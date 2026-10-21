import { describe, expect, test } from "vitest";

import {
    CONTINUOUS_LAYOUT,
    PAGED_LAYOUT,
    deriveLayout,
    ensureChapter,
    isPostLayout,
    parseStory,
    resolveLayout,
    serializeStory,
    storyBodyText,
    stripHtml,
} from "./story";

describe("parseStory", () => {
    test("reads a story document that arrives as an object", () => {
        const story = parseStory({
            chapters: [{ title: "One", body: "<p>First</p>", image: "a.png" }],
        });
        expect(story.chapters).toHaveLength(1);
        expect(story.chapters[0]).toEqual({
            title: "One",
            body: "<p>First</p>",
            image: "a.png",
        });
    });

    test("reads a story document that arrives as a JSON string", () => {
        const story = parseStory(
            JSON.stringify({
                chapters: [{ title: "One", body: "<p>First</p>" }],
            }),
        );
        expect(story.chapters).toHaveLength(1);
        expect(story.chapters[0].title).toBe("One");
    });

    test("treats a legacy HTML body as a single untitled chapter", () => {
        const story = parseStory("<p>Just an article</p>");
        expect(story.chapters).toEqual([
            { title: "", body: "<p>Just an article</p>", image: null },
        ]);
    });

    test("returns no chapters for empty or missing content", () => {
        expect(parseStory(null).chapters).toEqual([]);
        expect(parseStory(undefined).chapters).toEqual([]);
        expect(parseStory("").chapters).toEqual([]);
        expect(parseStory("   ").chapters).toEqual([]);
    });

    test("ignores chapters that are not objects and fills in the gaps", () => {
        const story = parseStory({
            chapters: [null, { title: 42, body: null }, { body: "<p>ok</p>" }],
        });
        expect(story.chapters).toEqual([
            { title: "", body: "", image: null },
            { title: "", body: "", image: null },
            { title: "", body: "<p>ok</p>", image: null },
        ]);
    });

    test("survives a document without chapters", () => {
        expect(parseStory({ something: "else" }).chapters).toEqual([]);
        expect(parseStory("{}").chapters).toEqual([]);
    });
});

describe("serializeStory", () => {
    test("round trips a story", () => {
        const chapters = [
            { title: "One", body: "<p>First</p>", image: "a.png" },
            { title: "Two", body: "<p>Second</p>", image: null },
        ];
        expect(parseStory(serializeStory(chapters)).chapters).toEqual(chapters);
    });

    test("writes the canonical document shape", () => {
        expect(serializeStory([{ title: "One", body: "<p>First</p>" }])).toBe(
            '{"chapters":[{"title":"One","body":"<p>First</p>","image":null}]}',
        );
    });
});

describe("deriveLayout", () => {
    test("a single chapter reads as an article", () => {
        expect(deriveLayout(0)).toBe(CONTINUOUS_LAYOUT);
        expect(deriveLayout(1)).toBe(CONTINUOUS_LAYOUT);
    });

    test("several chapters read as a photo essay", () => {
        expect(deriveLayout(2)).toBe(PAGED_LAYOUT);
        expect(deriveLayout(15)).toBe(PAGED_LAYOUT);
    });
});

describe("resolveLayout", () => {
    test("keeps a stored layout", () => {
        expect(resolveLayout(1, PAGED_LAYOUT)).toBe(PAGED_LAYOUT);
        expect(resolveLayout(7, CONTINUOUS_LAYOUT)).toBe(CONTINUOUS_LAYOUT);
    });

    test("falls back to the derived layout when nothing is stored", () => {
        expect(resolveLayout(1, null)).toBe(CONTINUOUS_LAYOUT);
        expect(resolveLayout(3, null)).toBe(PAGED_LAYOUT);
        expect(resolveLayout(3, undefined)).toBe(PAGED_LAYOUT);
    });

    test("falls back to the derived layout for a value it does not know", () => {
        expect(resolveLayout(3, "gallery" as never)).toBe(PAGED_LAYOUT);
    });
});

describe("isPostLayout", () => {
    test("knows the two layouts", () => {
        expect(isPostLayout(CONTINUOUS_LAYOUT)).toBe(true);
        expect(isPostLayout(PAGED_LAYOUT)).toBe(true);
        expect(isPostLayout("article")).toBe(false);
        expect(isPostLayout(null)).toBe(false);
    });
});

describe("storyBodyText", () => {
    test("joins the plain text of every chapter", () => {
        expect(
            storyBodyText([
                { title: "One", body: "<p>First</p>" },
                { title: "Two", body: "<p>Second</p>" },
            ]),
        ).toBe("First Second");
    });

    test("skips chapters without a body", () => {
        expect(
            storyBodyText([
                { title: "One", body: "" },
                { title: "Two", body: "<p>Second</p>" },
            ]),
        ).toBe("Second");
    });
});

describe("stripHtml", () => {
    test("removes the tags and collapses the whitespace", () => {
        expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world");
        expect(stripHtml("<p>a</p>\n<p>b</p>")).toBe("a b");
        expect(stripHtml("a&nbsp;b")).toBe("a b");
    });

    test("leaves plain text alone", () => {
        expect(stripHtml("Just words")).toBe("Just words");
    });
});

describe("ensureChapter", () => {
    test("keeps the chapters it is given", () => {
        const chapters = [{ title: "One", body: "<p>First</p>" }];
        expect(ensureChapter(chapters)).toBe(chapters);
    });

    test("gives an empty story one empty chapter", () => {
        expect(ensureChapter([])).toEqual([
            { title: "", body: "", image: null },
        ]);
    });
});
