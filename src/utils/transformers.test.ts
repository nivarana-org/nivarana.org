import { expect, test } from 'vitest'
import { titleCase } from './transformers'

test('converts titles as expected', () => {
  expect(titleCase("The catcher in the rye")).toBe("The Catcher in the Rye");
})