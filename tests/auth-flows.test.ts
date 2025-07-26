import { describe, it, expect, vi } from "vitest";
import { unstable_RouterContextProvider } from "react-router";
import { getTestContext } from "./test-utils";
import { action } from "../app/routes/signup";
import { appLoadContext } from "~/lib/middleware";

describe("auth flows", async () => {
  const mockFn = vi.fn();
  const { auth } = await getTestContext();
  // const { auth } = await getTestContext({
  //   emailVerification: {
  //     sendOnSignUp: true,
  //     sendVerificationEmail: async ({ user, url, token }, request) => {
  //       mockFn(user, url);
  //     },
  //   },
  // });

  it("signs up", async () => {
    const email = "testuser@example.com";
    const password = "testpassword123";
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);
    const request = new Request("http://localhost/signup", {
      method: "POST",
      body: form,
    });
    const context = new unstable_RouterContextProvider();
    context.set(appLoadContext, { auth });
    const result = await action({ request, context, params: {} });
    expect(result.status).toBe(302);
    expect(result.headers.get("location")).toBe("/");
    expect(result.headers.has("set-cookie")).toBe(true);

    const dupForm = new FormData();
    dupForm.append("email", email);
    dupForm.append("password", password);
    const dupRequest = new Request("http://localhost/signup", {
      method: "POST",
      body: dupForm,
    });
    const dupResult = await action({
      request: dupRequest,
      context,
      params: {},
    });
    expect(dupResult.status).toBe(302);
    expect(dupResult.headers.get("location")).toBe("/signin");
  });
});
