import { describe, expect, test } from "vitest";

import {
    SUGGESTION_LIMIT,
    escapeLike,
    normalizeQuery,
    toSuggestions,
} from "./matching";

describe("normalizeQuery", () => {
    test("trims and lowercases the query", () => {
        expect(normalizeQuery("  Narendra ModI  ")).toBe("narendra modi");
        expect(normalizeQuery("Ayushman")).toBe("ayushman");
    });

    test("keeps inner whitespace as typed", () => {
        expect(normalizeQuery("public health")).toBe("public health");
    });
});

describe("escapeLike", () => {
    test("escapes LIKE metacharacters", () => {
        expect(escapeLike("100%")).toBe("100\\%");
        expect(escapeLike("a_b")).toBe("a\\_b");
    });

    test("escapes backslashes before anything else", () => {
        expect(escapeLike("\\")).toBe("\\\\");
        expect(escapeLike("\\%")).toBe("\\\\\\%");
    });

    test("leaves ordinary queries untouched", () => {
        expect(escapeLike("narendra modi")).toBe("narendra modi");
    });
});

describe("toSuggestions", () => {
    test("builds the public href from the group prefix", () => {
        expect(
            toSuggestions(
                [{ name: "Vital Signs", path: "vital-signs" }],
                "/category/",
            ),
        ).toEqual([
            {
                name: "Vital Signs",
                path: "vital-signs",
                href: "/category/vital-signs",
            },
        ]);
    });

    test("drops rows without a path", () => {
        expect(
            toSuggestions([{ name: "Ghost", path: null }], "/author/"),
        ).toEqual([]);
    });

    test("collapses rows that share a path", () => {
        const rows = [
            { name: "Deepa Srinivasan", path: "deepa-srinivasan" },
            { name: "Deepa Srinivasan", path: "deepa-srinivasan" },
        ];
        expect(toSuggestions(rows, "/author/")).toHaveLength(1);
    });

    test("caps the group at the suggestion limit", () => {
        const rows = Array.from({ length: 10 }, (_, index) => ({
            name: `Tag ${index}`,
            path: `tag-${index}`,
        }));
        expect(toSuggestions(rows, "/tag/")).toHaveLength(SUGGESTION_LIMIT);
    });
});
