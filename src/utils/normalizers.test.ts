import { expect, test } from "vitest";
import { normalizeAsOldSlugs } from "./normalizers";

test('normalizes URLs such that the old slugs in DB work correctly', () => {
    expect(normalizeAsOldSlugs("India%E2%80%99s-Contraception-Conundrum")).toBe('India’s-Contraception-Conundrum');
    expect(normalizeAsOldSlugs("Medical-Industrial-Complex%3A-Then-And-Now")).toBe('Medical-Industrial-Complex:-Then-And-Now');
})