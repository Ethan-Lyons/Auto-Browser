import { test, expect } from '@jest/globals';
import { parseIf } from '../WebHelpers/If.js';

describe("parseIf", () => {
  test("parseIf: invalid action", async () => {
    const ifStep = { name: "FOO", args: [null] };
    await expect(parseIf(ifStep)).rejects.toThrow();
  });

  test("parseIf: valid action", async () => {
    const ifStep = { name: "IF", args: ["condition"] };
    const result = await parseIf(ifStep);
    expect(result).toEqual({ name: "IF", condition: "condition" });
  });

});