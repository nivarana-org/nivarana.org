import { expect, test } from "vitest";
import { getArticleByPath } from "./ContentRepository";

test("getArticleByPath functions as expected", async () => {
    expect(
        (
            await getArticleByPath(
                "how-unregulated-antifungal-creams-are-driving-indias-ringworm-epidemic",
            )
        )?.article.id,
    ).toBe(183);
});
