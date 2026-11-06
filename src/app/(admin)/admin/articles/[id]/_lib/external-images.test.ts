import { describe, expect, test } from "vitest";

import {
    collectExternalImageSources,
    replaceExternalImageSources,
} from "./external-images";

const chapter = (body: string) => ({ title: "", body, image: null });

describe("collectExternalImageSources", () => {
    test("collects unique external images across chapters", () => {
        const sources = collectExternalImageSources([
            chapter(
                '<p><img src="https://example.com/a.jpg"><img src="http://example.com/b.jpg"></p>',
            ),
            chapter(
                '<p><img src="https://example.com/a.jpg"><img src="../../images/kept.jpg"></p>',
            ),
        ]);

        expect(sources).toEqual([
            "https://example.com/a.jpg",
            "http://example.com/b.jpg",
        ]);
    });

    test("ignores images that are already stored locally", () => {
        expect(
            collectExternalImageSources([
                chapter('<img src="../../images/local.jpg">'),
            ]),
        ).toEqual([]);
    });

    test("ignores non-http sources and empty bodies", () => {
        expect(
            collectExternalImageSources([
                chapter('<img src="/images/local.jpg">'),
                chapter('<img src="data:image/png;base64,abc">'),
                chapter(""),
            ]),
        ).toEqual([]);
    });
});

describe("replaceExternalImageSources", () => {
    test("replaces only matching image sources", () => {
        const html =
            '<p><img src="https://example.com/a.jpg" alt="A">' +
            '<img src="https://example.com/other.jpg" alt="Other"></p>';

        const replaced = replaceExternalImageSources(
            html,
            new Map([["https://example.com/a.jpg", "../../images/a.jpg"]]),
        );

        expect(replaced).toContain('src="../../images/a.jpg"');
        expect(replaced).toContain('src="https://example.com/other.jpg"');
        expect(replaced).toContain('alt="A"');
    });

    test("leaves the body untouched when there is nothing to replace", () => {
        const html = '<p><img src="https://example.com/a.jpg"></p>';
        expect(replaceExternalImageSources(html, new Map())).toBe(html);
    });
});
