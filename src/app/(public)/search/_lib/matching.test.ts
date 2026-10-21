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
    test("builds the public href from the key and the group prefix", () => {
        const rows = [{ name: "Vital Signs", path: "vital-signs" }];
        expect(toSuggestions(rows, (row) => row.path, "/category/")).toEqual([
            { name: "Vital Signs", href: "/category/vital-signs" },
        ]);
    });

    test("drops rows without a linkable key", () => {
        const rows = [{ name: "Ghost", slug: null }];
        expect(toSuggestions(rows, (row) => row.slug, "/author/")).toEqual([]);
    });

    test("collapses rows that share a key", () => {
        const rows = [
            { name: "Deepa Srinivasan", slug: "deepa-srinivasan" },
            { name: "Deepa Srinivasan", slug: "deepa-srinivasan" },
        ];
        expect(toSuggestions(rows, (row) => row.slug, "/author/")).toEqual([
            { name: "Deepa Srinivasan", href: "/author/deepa-srinivasan" },
        ]);
    });

    test("caps the group at the suggestion limit", () => {
        const rows = Array.from({ length: 20 }, (_, index) => ({
            name: `Tag ${index}`,
            path: `tag-${index}`,
        }));
        const result = toSuggestions(rows, (row) => row.path, "/tag/");
        expect(result).toHaveLength(SUGGESTION_LIMIT);
    });

    test("honours an explicit limit", () => {
        const rows = Array.from({ length: 5 }, (_, index) => ({
            name: `Category ${index}`,
            path: `category-${index}`,
        }));
        expect(
            toSuggestions(rows, (row) => row.path, "/category/", 2),
        ).toHaveLength(2);
    });
});
