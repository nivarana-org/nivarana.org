import { sluggify } from "@/utils/string";

export const articleEditReducer = (draft, action) => {
    switch (action.type) {
        case "title":
            draft.title = action.value;
            if (draft.pathManuallySet || draft.pathIsReadOnly) return draft;
            draft.path = sluggify(action.value);
            return draft;
        case "path":
            if (draft.pathIsReadOnly) return draft;
            draft.path = action.value;
            draft.pathManuallySet = true;
            return draft;
        case "freeze-path":
            draft.pathIsReadOnly = true;
            return draft;
    }
};
