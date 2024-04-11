const { sortPages } = require("./report.js");
const { test, expect } = require("@jest/globals");

test("sortPages", () => {
  const input = {
    page1: 6,
    page2: 1,
    page3: 3,
    page4: 12,
    page5: 7,
    page6: 6,
  };
  const actual = sortPages(input);
  const expected = [
    ["page4", 12],
    ["page5", 7],
    ["page1", 6],
    ["page6", 6],
    ["page3", 3],
    ["page2", 1],
  ];
  expect(actual).toEqual(expected);
});

test("sortPages null case", () => {
  const input = {};
  const actual = sortPages(input);
  const expected = [];
  expect(actual).toEqual(expected);
});
