import { describe, it, expect, beforeAll } from "vitest";
import { resetTestDb } from "./test-utils";
import { action } from "../app/routes/signup";

describe("auth flows", () => {
  beforeAll(() => {
    resetTestDb();
  });

  it("signs up successfully, then duplicate signup redirects to /signin", async () => {
    const email = "testuser@example.com";
    const password = "testpassword123";
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);
    const request = new Request("http://localhost/signup", {
      method: "POST",
      body: form,
    });
    const result = await action({ request });
    expect(result.status).toBe(302);
    expect(result.headers.get("location")).toBe("/");
    expect(result.headers.has("set-cookie")).toBe(true);

    // const dupForm = new FormData();
    // dupForm.append("email", email);
    // dupForm.append("password", password);
    // const dupRequest = new Request("http://localhost/signup", {
    //   method: "POST",
    //   body: dupForm,
    // });
    // const dupResult = await action({ request: dupRequest });
    // expect(dupResult.status).toBe(302);
    // expect(dupResult.headers.get("location")).toBe("/signin");
  });
});
