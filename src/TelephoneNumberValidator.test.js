import telephoneCheck from "./TelephoneNumberValidator"

describe ("telephoneCheck", () =>{
    test("1 555-555-5555", () => {
        expect(telephoneCheck("1 555-555-5555")).toBe(true)
    });
    test("1 (555) 555-5555", () => {
        expect(telephoneCheck("1 (555) 555-5555")).toBe(true)
    });
    test("5555555555", () => {
        expect(telephoneCheck("5555555555")).toBe(true)
    });
    test("555-555-5555", () => {
        expect(telephoneCheck("555-555-5555")).toBe(true)
    });
    test("(555)555-5555", () => {
        expect(telephoneCheck("(555)555-5555")).toBe(true)
    });
    test("1(555)555-5555", () => {
        expect(telephoneCheck("1(555)555-5555")).toBe(false)
    });
    test("555-5555", () => {
        expect(telephoneCheck("555-5555")).toBe(false)
    });
    test("5555555", () => {
        expect(telephoneCheck("5555555")).toBe(false)
    });
    test("1 555)555-5555", () => {
        expect(telephoneCheck("1 555)555-5555")).toBe(false)
    });
    test("1 555 555 5555", () => {
        expect(telephoneCheck("1 555 555 5555")).toBe(true)
    });
    test("1 456 789 4444", () => {
        expect(telephoneCheck("1 456 789 4444")).toBe(true)
    });
    test("123**&!!asdf#", () => {
        expect(telephoneCheck("123**&!!asdf#")).toBe(false)
    });
    test("55555555", () => {
        expect(telephoneCheck("55555555")).toBe(false)
    });
    test("(6054756961)", () => {
        expect(telephoneCheck("(6054756961)")).toBe(false)
    });
    test("2 (757) 622-7382", () => {
        expect(telephoneCheck("2 (757) 622-7382")).toBe(false)
    });
    test("0 (757) 622-7382", () => {
        expect(telephoneCheck("0 (757) 622-7382")).toBe(false)
    });
    test("-1 (757) 622-7382", () => {
        expect(telephoneCheck("-1 (757) 622-7382")).toBe(false)
    });
    test("2 757 622-7382", () => {
        expect(telephoneCheck("2 757 622-7382")).toBe(false)
    });
    test("10 (757) 622-7382", () => {
        expect(telephoneCheck("10 (757) 622-7382")).toBe(false)
    });
    test("27576227382", () => {
        expect(telephoneCheck("27576227382")).toBe(false)
    });
    test("(275)76227382", () => {
        expect(telephoneCheck("(275)76227382")).toBe(false)
    });
    test("2(757)6227382", () => {
        expect(telephoneCheck("2(757)6227382")).toBe(false)
    });
    test("2(757)622-7382", () => {
        expect(telephoneCheck("2(757)622-7382")).toBe(false)
    });
    test("555)-555-5555", () => {
        expect(telephoneCheck("555)-555-5555")).toBe(false)
    });
    test("(555-555-5555", () => {
        expect(telephoneCheck("(555-555-5555")).toBe(false)
    });
    test("(555)5(55?)-5555", () => {
        expect(telephoneCheck("(555)5(55?)-5555")).toBe(false)
    });
});