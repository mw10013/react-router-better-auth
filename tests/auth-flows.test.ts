import { describe, it, expect, vi } from "vitest";
import { unstable_RouterContextProvider } from "react-router";
import { getTestContext } from "./test-utils";
import { action } from "../app/routes/signup";
import { appLoadContext } from "~/lib/middleware";

describe("auth flows basic", async () => {
  const mockFn = vi.fn();
  // const { auth } = await getTestContext();
  const { auth, database } = await getTestContext({
    betterAuthOptions: {
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }, request) => {
          console.log("Stub: sendResetPassword", {
            to: user.email,
            url,
            token,
          });
        },
        onPasswordReset: async ({ user }, request) => {
          console.log(`Stub: Password for user ${user.email} has been reset.`);
        },
      },
      emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
          mockFn(user, url);
        },
      },
    },
  });

	it("should work with custom fields on account table", async () => {
		const res = await auth.api.signUpEmail({
			body: {
				email: "email@test.com",
				password: "password",
				name: "Test Name",
				image: "https://picsum.photos/200",
			},
		});
		expect(res.token).toBeDefined();
		// const accounts = await database.findMany({
		// 	model: "account",
		// });
		// expect(accounts).toHaveLength(1);
	});

	// it("should send verification email", async () => {
	// 	expect(mockFn).toHaveBeenCalledWith(expect.any(Object), expect.any(String));
	// });
});

describe("auth flows", async () => {
  const mockFn = vi.fn();
  // const { auth } = await getTestContext();
  const { auth } = await getTestContext({
    // betterAuthOptions: {
    //   emailAndPassword: {
    //     enabled: true,
    //     requireEmailVerification: true,
    //     sendResetPassword: async ({ user, url, token }, request) => {
    //       console.log("Stub: sendResetPassword", {
    //         to: user.email,
    //         url,
    //         token,
    //       });
    //     },
    //     onPasswordReset: async ({ user }, request) => {
    //       console.log(`Stub: Password for user ${user.email} has been reset.`);
    //     },
    //   },
    //   emailVerification: {
    //     sendOnSignUp: true,
    //     sendVerificationEmail: async ({ user, url, token }, request) => {
    //       mockFn(user, url);
    //     },
    //   },
    // },
  });

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

    //   const dupForm = new FormData();
    //   dupForm.append("email", email);
    //   dupForm.append("password", password);
    //   const dupRequest = new Request("http://localhost/signup", {
    //     method: "POST",
    //     body: dupForm,
    //   });
    //   const dupResult = await action({
    //     request: dupRequest,
    //     context,
    //     params: {},
    //   });
    //   expect(dupResult.status).toBe(302);
    //   expect(dupResult.headers.get("location")).toBe("/signin");
  });
});
