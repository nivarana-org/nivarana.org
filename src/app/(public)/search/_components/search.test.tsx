import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import Search from "./search";

import type { Suggestions } from "@/types/nivarana";

const { push, replace } = vi.hoisted(() => ({
    push: vi.fn(),
    replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push, replace }),
    usePathname: () => "/search",
    useSearchParams: () => new URLSearchParams(),
}));

const SUGGESTIONS: Suggestions = {
    authors: [
        {
            name: "Deepa Srinivasan",
            path: "deepa-srinivasan",
            href: "/author/deepa-srinivasan",
        },
    ],
    categories: [
        {
            name: "Reality Check",
            path: "reality-check",
            href: "/category/reality-check",
        },
    ],
    tags: [],
};

const fetchMock = vi.fn(async () => ({
    ok: true,
    json: async () => SUGGESTIONS,
}));

const ACT_ENV = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
};
ACT_ENV.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

const input = () => container.querySelector<HTMLInputElement>("input")!;
const listbox = () => container.querySelector('[role="listbox"]');
const options = () =>
    Array.from(container.querySelectorAll('[role="option"]')).map(
        (option) => option.textContent ?? "",
    );

/** Sets the value through the prototype so React's value tracker sees the change. */
const setNativeValue = (element: HTMLInputElement, value: string) => {
    const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
    )?.set;
    setter?.call(element, value);
};

const type = async (value: string) => {
    await act(async () => {
        const element = input();
        setNativeValue(element, value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
    });
};

const press = async (key: string) => {
    await act(async () => {
        input().dispatchEvent(
            new KeyboardEvent("keydown", { key, bubbles: true }),
        );
    });
};

/** Advances fake time far enough to flush the suggestion debounce. */
const tick = async (ms = 250) => {
    await act(async () => {
        await vi.advanceTimersByTimeAsync(ms);
    });
};

const click = async (element: Element) => {
    await act(async () => {
        element.dispatchEvent(
            new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
        );
        element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
};

beforeEach(async () => {
    vi.useFakeTimers();
    fetchMock.mockClear();
    push.mockClear();
    replace.mockClear();
    vi.stubGlobal("fetch", fetchMock);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => {
        root.render(<Search placeholder="enter text to search" />);
    });
});

afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe("search suggestions", () => {
    test("opens with just the plain search row until suggestions arrive", async () => {
        await type("deepa");

        expect(listbox()).not.toBeNull();
        expect(options()).toEqual(["Search for “deepa”"]);
        expect(fetchMock).not.toHaveBeenCalled();

        await tick();

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/search/suggest?q=deepa",
            expect.anything(),
        );
        expect(options()).toEqual([
            "Deepa Srinivasan",
            "Reality Check",
            "Search for “deepa”",
        ]);
    });

    test("does not fetch while the input is empty", async () => {
        await type("   ");
        await tick(1000);

        expect(listbox()).toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test("Enter with nothing highlighted runs the plain text search", async () => {
        await type("deepa");
        await press("Enter");

        expect(replace).toHaveBeenCalledWith("/search?q=deepa");
        expect(push).not.toHaveBeenCalled();
        expect(listbox()).toBeNull();
    });

    test("arrow keys highlight an option and Enter navigates to it", async () => {
        await type("deepa");
        await tick();

        await press("ArrowDown");
        expect(input().getAttribute("aria-activedescendant")).toBe(
            "authors-deepa-srinivasan",
        );

        await press("ArrowDown");
        expect(input().getAttribute("aria-activedescendant")).toBe(
            "categories-reality-check",
        );

        await press("Enter");
        expect(push).toHaveBeenCalledWith("/category/reality-check");
        expect(listbox()).toBeNull();
    });

    test("clicking a suggestion navigates to its page", async () => {
        await type("deepa");
        await tick();

        const author = Array.from(
            container.querySelectorAll('[role="option"]'),
        ).find((option) => option.textContent === "Deepa Srinivasan");
        expect(author).toBeDefined();

        await click(author!);

        expect(push).toHaveBeenCalledWith("/author/deepa-srinivasan");
        expect(listbox()).toBeNull();
    });

    test("Escape closes the dropdown, a new keystroke reopens it", async () => {
        await type("deepa");
        await tick();
        expect(listbox()).not.toBeNull();

        await press("Escape");
        expect(listbox()).toBeNull();

        await type("deep");
        expect(listbox()).not.toBeNull();
    });

    test("clicking outside closes the dropdown", async () => {
        await type("deepa");
        await tick();
        expect(listbox()).not.toBeNull();

        await act(async () => {
            document.body.dispatchEvent(
                new Event("pointerdown", { bubbles: true }),
            );
        });

        expect(listbox()).toBeNull();
    });
});
