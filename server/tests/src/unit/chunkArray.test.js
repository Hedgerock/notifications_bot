import {chunkArray} from "../../../utils/index.js";

test("Chunk array tests", () => {
    //given
    const raw = [1, 2, 3, 4];
    //when
    const actualValue = chunkArray(raw, 2);
    //then
    expect(actualValue).toHaveLength(2);
    expect(actualValue).toEqual([[1, 2], [3, 4]]);
})