(function () {
    const option = (name) => (editor) => editor.options.get(name);
    const register$2 = (editor) => {
        const registerOption = editor.options.register;
        registerOption("allow_html_in_definition", {
            processor: "boolean",
            default: true,
        });
    };
    const allowHtmlInDefinition = option("allow_html_in_definition");

    const dfnSelector = "dfn";
    const isEmptyString = (str) => !str;
    const getTitleFromDfn = (elm) => {
        const title = elm.getAttribute("title");
        return title || "";
    };
    const isDefinition = (elm) => elm.nodeName.toLowerCase() === "dfn";
    const isDefined = (elm) => isDefinition(elm) && getTitleFromDfn(elm) !== "";
    const isEmptyDefinition = (elm) => isDefined(elm) && !elm.firstChild;

    const removeEmptyDefinitionsInSelection = (editor) => {
        const dom = editor.dom;
        tinymce.dom.RangeUtils(dom).walk(editor.selection.getRng(), (nodes) => {
            tinymce.util.Tools.each(nodes, (node) => {
                if (isEmptyDefinition(node)) {
                    dom.remove(node, false);
                }
            });
        });
    };
    const getDefinition = (editor) =>
        editor.dom.getParent(editor.selection.getStart(), dfnSelector);
    const getTitle = (editor) => {
        const dfn = getDefinition(editor);
        if (dfn) {
            return getTitleFromDfn(dfn);
        } else {
            return "";
        }
    };
    const createDfn = (editor, title) => {
        editor.undoManager.transact(() => {
            if (!allowHtmlInDefinition(editor)) {
                editor.selection.collapse(true);
            }
            if (editor.selection.isCollapsed()) {
                editor.insertContent(editor.dom.createHTML("dfn", { title }));
            } else {
                removeEmptyDefinitionsInSelection(editor);
                editor.formatter.remove(
                    "definition",
                    undefined,
                    undefined,
                    true,
                );
                editor.formatter.apply("definition", { value: title });
                editor.addVisual();
            }
        });
    };
    const updateDfn = (editor, title, dfnElement) => {
        dfnElement.removeAttribute("title");
        dfnElement.title = title;
        editor.addVisual();
        editor.undoManager.add();
    };
    const insert = (editor, title) => {
        const dfn = getDefinition(editor);
        if (dfn) {
            updateDfn(editor, title, dfn);
        } else {
            createDfn(editor, title);
        }
        editor.focus();
    };

    const insertDfn = (editor, newDfn) => {
        insert(editor, newDfn);
        return true;
    };
    const open = (editor) => {
        const currentTitle = getTitle(editor);
        editor.windowManager.open({
            title: "Definition",
            size: "normal",
            body: {
                type: "panel",
                items: [
                    {
                        name: "title",
                        type: "input",
                        label: "Title",
                        placeholder: "here is what that means",
                    },
                ],
            },
            buttons: [
                {
                    type: "cancel",
                    name: "cancel",
                    text: "Cancel",
                },
                {
                    type: "submit",
                    name: "save",
                    text: "Save",
                    primary: true,
                },
            ],
            initialData: { title: currentTitle },
            onSubmit: (api) => {
                if (insertDfn(editor, api.getData().title)) {
                    api.close();
                }
            },
        });
    };

    const register$1 = (editor) => {
        editor.addCommand("nivDfn", () => {
            open(editor);
        });
    };

    const isDfnNode = (node) => !isEmptyString(node.attr("title"));
    const isEmptyDfnNode = (node) => isDfnNode(node) && !node.firstChild;
    const setContentEditable = (state) => (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (isEmptyDfnNode(node)) {
                node.attr("contenteditable", state);
            }
        }
    };
    const setup = (editor) => {
        editor.on("PreInit", () => {
            editor.parser.addNodeFilter("dfn", setContentEditable("false"));
            editor.serializer.addNodeFilter("dfn", setContentEditable(null));
        });
    };

    const registerFormats = (editor) => {
        editor.formatter.register("definition", {
            inline: "dfn",
            selector: dfnSelector,
            remove: "all",
            split: true,
            deep: true,
            attributes: { title: "%value" },
            onmatch: (node, _fmt, _itemName) => {
                return isDefined(node);
            },
        });
    };

    const onSetupEditable = (editor) => (api) => {
        const nodeChanged = () => {
            api.setEnabled(editor.selection.isEditable());
        };
        editor.on("NodeChange", nodeChanged);
        nodeChanged();
        return () => {
            editor.off("NodeChange", nodeChanged);
        };
    };
    const register = (editor) => {
        const onAction = () => editor.execCommand("nivDfn");
        editor.ui.registry.addToggleButton("dfn", {
            icon: "ai-prompt",
            tooltip: "Definition",
            onAction,
            onSetup: (buttonApi) => {
                const unbindSelectorChanged =
                    editor.selection.selectorChangedWithUnbind(
                        "dfn",
                        buttonApi.setActive,
                    ).unbind;
                const unbindEditableChanged =
                    onSetupEditable(editor)(buttonApi);
                return () => {
                    unbindSelectorChanged();
                    unbindEditableChanged();
                };
            },
        });
        editor.ui.registry.addMenuItem("dfn", {
            icon: "ai-prompt",
            text: "Definition...",
            onAction,
            onSetup: onSetupEditable(editor),
        });
    };

    const Plugin = () => {
        tinymce.PluginManager.add("dfn", (editor) => {
            register$2(editor);
            setup(editor);
            register$1(editor);
            register(editor);
            editor.on("PreInit", () => {
                registerFormats(editor);
            });
        });
    };

    Plugin();
})();
