import reducer from "reducers/application";

describe("Application Reducer", () => {
  it("thows an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrow(
      /tried to reduce with unsupported action type/i
    );
  });
});
