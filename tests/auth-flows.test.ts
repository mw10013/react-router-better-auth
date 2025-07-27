import { describe, it, expect, vi } from "vitest";
import { unstable_RouterContextProvider } from "react-router";
import { getTestContext } from "./test-utils";
import { action } from "../app/routes/signup";
import { appLoadContext } from "~/lib/middleware";
import { signUpEmailTest } from "./signUpEmailTest";
import { mock } from "node:test";

// describe("signUpEmailTest", async () => {
//   it("should signUpEmailTest", async () => {
//     await signUpEmailTest();
//   });
// });

describe("auth flows sign up basic", async () => {
  const email = "email@test.com";
  const password = "password";
  const name = "";

  const mockSendVerificationEmail = vi.fn().mockResolvedValue(undefined);
  const { auth } = await getTestContext({
    betterAuthOptions: {
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
      },
      emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: mockSendVerificationEmail,
      },
    },
  });

  it("should signUpEmail", async () => {
    const signUpEmailResponse = await auth.api.signUpEmail({
      asResponse: true,
      body: {
        email,
        password,
        name,
      },
    });
    expect(signUpEmailResponse.ok).toBe(true);
    expect(mockSendVerificationEmail).toHaveBeenCalledTimes(1);
    expect(mockSendVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ email }),
      }),
      undefined
    );
    console.log(
      "token:",
      mockSendVerificationEmail.mock.calls.at(0)?.at(0)?.token
    );
    const token = mockSendVerificationEmail.mock.calls.at(0)?.at(0)?.token;
    expect(token).toBeDefined();

    const signUpEmailResponse1 = await auth.api.signUpEmail({
      asResponse: true,
      body: {
        email,
        password,
        name,
      },
    });
    expect(signUpEmailResponse1.status).toBe(422);
    const signUpEmailResponse1Body = await signUpEmailResponse1.json();
    expect(signUpEmailResponse1Body?.code).toBe("USER_ALREADY_EXISTS");

    const signInEmailResponse = await auth.api.signInEmail({
      asResponse: true,
      body: { email, password },
    });
    expect(signInEmailResponse.status).toBe(403);
    const signInEmailResponseBody = await signInEmailResponse.json();
    expect(signInEmailResponseBody?.code).toBe("EMAIL_NOT_VERIFIED");
  });
});

// describe("auth flows", async () => {
//   const mockFn = vi.fn();
//   const { auth } = await getTestContext({
//     betterAuthOptions: {
//       emailAndPassword: {
//         enabled: true,
//         requireEmailVerification: true,
//         sendResetPassword: async ({ user, url, token }, request) => {
//           console.log("Stub: sendResetPassword", {
//             to: user.email,
//             url,
//             token,
//           });
//         },
//         onPasswordReset: async ({ user }, request) => {
//           console.log(`Stub: Password for user ${user.email} has been reset.`);
//         },
//       },
//       emailVerification: {
//         sendOnSignUp: true,
//         sendVerificationEmail: async ({ user, url, token }, request) => {
//           mockFn(user, url);
//         },
//       },
//     },
//   });

//   it("signs up", async () => {
//     const email = "testuser@example.com";
//     const password = "testpassword123";
//     const form = new FormData();
//     form.append("email", email);
//     form.append("password", password);
//     const request = new Request("http://localhost/signup", {
//       method: "POST",
//       body: form,
//     });
//     const context = new unstable_RouterContextProvider();
//     context.set(appLoadContext, { auth });
//     const result = await action({ request, context, params: {} });
//     expect(result.status).toBe(302);
//     expect(result.headers.get("location")).toBe("/");
//     expect(result.headers.has("set-cookie")).toBe(true);

//     //   const dupForm = new FormData();
//     //   dupForm.append("email", email);
//     //   dupForm.append("password", password);
//     //   const dupRequest = new Request("http://localhost/signup", {
//     //     method: "POST",
//     //     body: dupForm,
//     //   });
//     //   const dupResult = await action({
//     //     request: dupRequest,
//     //     context,
//     //     params: {},
//     //   });
//     //   expect(dupResult.status).toBe(302);
//     //   expect(dupResult.headers.get("location")).toBe("/signin");
//   });
// });
