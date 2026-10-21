import { sluggify } from "@/utils/string";

/**
 * The title and the slug of a post while it is being edited.
 */
export type ArticleEditState = {
    title: string;
    slug: string;
    /** Set once the author types the slug by hand. */
    slugManuallySet?: boolean;
    /** Set when the slug can no longer be changed. */
    slugIsReadOnly: boolean;
};

export type ArticleEditAction =
    | { type: "title"; value: string }
    | { type: "slug"; value: string }
    | { type: "freeze-slug" }
    | { type: "reset" };

export const articleEditReducer = (
    draft: ArticleEditState,
    action: ArticleEditAction,
) => {
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
