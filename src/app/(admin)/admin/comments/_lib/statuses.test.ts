import { describe, expect, it } from "vitest";

import { COMMENT_STATUSES, isCommentStatus } from "./statuses";

describe("isCommentStatus", () => {
    it.each(COMMENT_STATUSES)("accepts %s", (status) => {
        expect(isCommentStatus(status)).toBe(true);
    });

    it("rejects values that are not comment statuses", () => {
        expect(isCommentStatus("published")).toBe(false);
        expect(isCommentStatus("")).toBe(false);
        expect(isCommentStatus(null)).toBe(false);
        expect(isCommentStatus(undefined)).toBe(false);
        expect(isCommentStatus(["pending"])).toBe(false);
    });
});
