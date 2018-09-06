import conertToRoman from "./roman-numbers"

describe("conertToRoman", () => {
    test("2", () => {
        expect(conertToRoman(2)).toBe("II")
    });
    test("3", () => {
        expect(conertToRoman(3)).toBe("III")
    });
    test("4", () => {
        expect(conertToRoman(4)).toBe("IV")
    });
    test("5", () => {
        expect(conertToRoman(5)).toBe("V")
    });
    test("9", () => {
        expect(conertToRoman(9)).toBe("IX")
    });
    test("12", () => {
        expect(conertToRoman(12)).toBe("XII")
    });
    test("16", () => {
        expect(conertToRoman(16)).toBe("XVI")
    });
    test("29", () => {
        expect(conertToRoman(29)).toBe("XXIX")
    });
    test("44", () => {
        expect(conertToRoman(44)).toBe("XLIV")
    });
    test("45", () => {
        expect(conertToRoman(45)).toBe("XLV")
    });
    test("68", () => {
        expect(conertToRoman(68)).toBe("LXVIII")
    });
    test("83", () => {
        expect(conertToRoman(83)).toBe("LXXXIII")
    });
    test("97", () => {
        expect(conertToRoman(97)).toBe("XCVII")
    });
    test("99", () => {
        expect(conertToRoman(99)).toBe("XCIX")
    });
    test("400", () => {
        expect(conertToRoman(400)).toBe("CD")
    });
    test("500", () => {
        expect(conertToRoman(500)).toBe("D")
    });
    test("501", () => {
        expect(conertToRoman(501)).toBe("DI")
    });
    test("649", () => {
        expect(conertToRoman(649)).toBe("DCXLIX")
    });
    test("798", () => {
        expect(conertToRoman(798)).toBe("DCCXCVIII")
    });
    test("891", () => {
        expect(conertToRoman(891)).toBe("DCCCXCI")
    });
    test("1000", () => {
        expect(conertToRoman(1000)).toBe("M")
    });
    test("1004", () => {
        expect(conertToRoman(1004)).toBe("MIV")
    });
    test("1006", () => {
        expect(conertToRoman(1006)).toBe("MVI")
    });
    test("1023", () => {
        expect(conertToRoman(1023)).toBe("MXXIII")
    });
    test("2014", () => {
        expect(conertToRoman(2014)).toBe("MMXIV")
    });
    test("3999", () => {
        expect(conertToRoman(3999)).toBe("MMMCMXCIX")
    });
});