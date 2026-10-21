import type { Editor, AstNode } from "tinymce";

declare const tinymce: {
    dom: {
        RangeUtils: (dom: unknown) => {
            walk: (rng: unknown, callback: (nodes: Node[]) => void) => void;
        };
    };
    util: {
        Tools: {
            each: <T>(arr: T[], cb: (node: T) => void) => void;
        };
    };
    PluginManager: {
        add: (name: string, callback: (editor: Editor) => void) => void;
    };
};

(function () {
    const option =
        (name: string) =>
        (editor: Editor): boolean =>
            editor.options.get(name);

    const register$2 = (editor: Editor): void => {
        const registerOption = editor.options.register;
        registerOption("allow_html_in_definition", {
            processor: "boolean",
            default: true,
        });
    };
    const allowHtmlInDefinition = option("allow_html_in_definition");

    const dfnSelector = "dfn";
    const isEmptyString = (str: string | null | undefined): boolean => !str;

    const getTitleFromDfn = (elm: Element): string => {
        const title = elm.getAttribute("title");
        return title || "";
    };

    const isDefinition = (elm: Element): boolean =>
        elm.nodeName.toLowerCase() === "dfn";
    const isDefined = (elm: Element): boolean =>
        isDefinition(elm) && getTitleFromDfn(elm) !== "";
    const isEmptyDefinition = (elm: Element): boolean =>
        isDefined(elm) && !elm.firstChild;

    const removeEmptyDefinitionsInSelection = (editor: Editor): void => {
        const dom = editor.dom;
        tinymce.dom
            .RangeUtils(dom)
            .walk(editor.selection.getRng(), (nodes: Node[]) => {
                tinymce.util.Tools.each(nodes, (node: Node) => {
                    if (
                        node.nodeType === 1 &&
                        isEmptyDefinition(node as Element)
                    ) {
                        dom.remove(node, false);
                    }
                });
            });
    };

    const getDefinition = (editor: Editor): Element | null =>
        editor.dom.getParent(editor.selection.getStart(), dfnSelector);

    const getTitle = (editor: Editor): string => {
        const dfn = getDefinition(editor);
        if (dfn) {
            return getTitleFromDfn(dfn);
        } else {
            return "";
        }
    };

    const createDfn = (editor: Editor, title: string): void => {
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

    const updateDfn = (
        editor: Editor,
        title: string,
        dfnElement: Element,
    ): void => {
        dfnElement.removeAttribute("title");
        dfnElement.setAttribute("title", title);
        editor.addVisual();
        editor.undoManager.add();
    };

    const insert = (editor: Editor, title: string): void => {
        const dfn = getDefinition(editor);
        if (dfn) {
            updateDfn(editor, title, dfn);
        } else {
            createDfn(editor, title);
        }
        editor.focus();
    };

    const insertDfn = (editor: Editor, newDfn: string): boolean => {
        insert(editor, newDfn);
        return true;
    };

    const open = (editor: Editor): void => {
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
                if (
                    insertDfn(
                        editor,
                        (api.getData() as { title: string }).title,
                    )
                ) {
                    api.close();
                }
            },
        });
    };

    const register$1 = (editor: Editor): void => {
        editor.addCommand("nivDfn", () => {
            open(editor);
        });
    };

    const isDfnNode = (node: AstNode): boolean =>
        !isEmptyString(node.attr("title"));
    const isEmptyDfnNode = (node: AstNode): boolean =>
        isDfnNode(node) && !node.firstChild;

    const setContentEditable =
        (state: string | null) =>
        (nodes: AstNode[]): void => {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (isEmptyDfnNode(node)) {
                    node.attr("contenteditable", state);
                }
            }
        };

    const setup = (editor: Editor): void => {
        editor.on("PreInit", () => {
            editor.parser.addNodeFilter("dfn", setContentEditable("false"));
            editor.serializer.addNodeFilter("dfn", setContentEditable(null));
        });
    };

    const registerFormats = (editor: Editor): void => {
        editor.formatter.register("definition", {
            inline: "dfn",
            selector: dfnSelector,
            remove: "all",
            split: true,
            deep: true,
            attributes: { title: "%value" },
            onmatch: (node: Element) => {
                return isDefined(node);
            },
        });
    };

    const onSetupEditable =
        (editor: Editor) =>
        (api: { setEnabled: (state: boolean) => void }): (() => void) => {
            const nodeChanged = () => {
                api.setEnabled(editor.selection.isEditable());
            };
            editor.on("NodeChange", nodeChanged);
            nodeChanged();
            return () => {
                editor.off("NodeChange", nodeChanged);
            };
        };

    const register = (editor: Editor): void => {
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

    const Plugin = (): void => {
        tinymce.PluginManager.add("dfn", (editor: Editor) => {
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
