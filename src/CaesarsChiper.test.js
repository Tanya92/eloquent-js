import rot13 from "./CaesarsChiper"

    describe("rot13", () => {
        test("SERR PBQR PNZC", () => {
           expect(rot13("SERR PBQR PNZC")).toBe("FREE CODE CAMP")
        });
        test("SERR CVMMN!", () => {
            expect(rot13("SERR CVMMN!")).toBe("FREE PIZZA!")
        });
        test("SERR YBIR?", () => {
            expect(rot13("SERR YBIR?")).toBe("FREE LOVE?")
        });
        test("GUR DHVPX OEBJA SBK WHZCF BIRE GUR YNML QBT", () => {
            expect(rot13("GUR DHVPX OEBJA SBK WHZCF BIRE GUR YNML QBT")).toBe("THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG")
        });

    });