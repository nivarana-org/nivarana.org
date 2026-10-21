import { sluggify } from "@/utils/string";

export const articleEditReducer = (draft, action) => {
    switch (action.type) {
        case "title":
            draft.title = action.value;
            if (draft.slugManuallySet || draft.slugIsReadOnly) return draft;
            draft.slug = sluggify(action.value);
            return draft;
        case "slug":
            if (draft.slugIsReadOnly) return draft;
            draft.slug = action.value;
            draft.slugManuallySet = true;
            return draft;
        case "freeze-slug":
            draft.slugIsReadOnly = true;
            return draft;
        case "reset":
            draft.title = "";
            draft.slug = "";
            draft.slugManuallySet = false;
            return draft;
    }
};
