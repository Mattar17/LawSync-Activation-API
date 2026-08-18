import {
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import generateToken from "@/Services/generateToken.js";

describe("generate token", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.restoreAllMocks();
  });

  it("should throw an error if JWT_SECRET is missing", async () => {
    delete process.env.JWT_SECRET;
    expect(
      generateToken({
        lawyer_email: "test@gmail.com",
        lawyer_id: "testID",
        is_admin: false,
      }),
    ).rejects.toThrow("cannot generate jwt token");
  });
});
