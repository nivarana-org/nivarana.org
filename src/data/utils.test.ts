import { expect, test } from "vitest";
import { groupOrderAndSelect } from "./utils";

test("groupOrderAndSelect correctly", () => {
    expect(
        groupOrderAndSelect(
            [
                { t: "movie", year: 1993, name: "titanic" },
                { t: "movie", year: 1960, name: "charlie chaplin" },
            ],
            "t",
            "year",
            "name",
        ),
    ).toStrictEqual({ movie: ["charlie chaplin", "titanic"] });
});
