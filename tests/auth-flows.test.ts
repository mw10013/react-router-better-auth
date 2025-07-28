import { describe, it, expect, vi } from "vitest";
import { unstable_RouterContextProvider } from "react-router";
import { getTestContext } from "./test-utils";
import { action } from "../app/routes/signup";
import { appLoadContext } from "~/lib/middleware";
import { signUpEmailTest } from "./signUpEmailTest";

describe("auth flows sign up basic", async () => {
  const email = "email@test.com";
  const password = "password";
  const name = "";
  const callbackURL = "/dashboard";
  const headers = new Headers();
  let emailVerificationUrl: string | undefined;

  const mockSendVerificationEmail = vi.fn().mockResolvedValue(undefined);
  const { auth } = await getTestContext({
    betterAuthOptions: {
      emailVerification: {
        sendVerificationEmail: mockSendVerificationEmail,
      },
    },
  });

  it("should should sign up", async () => {
    const response = await auth.api.signUpEmail({
      asResponse: true,
      body: {
        email,
        password,
        name,
        callbackURL,
      },
    });
    expect(response.ok).toBe(true);
    expect(mockSendVerificationEmail).toHaveBeenCalledTimes(1);
    expect(mockSendVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ email }),
      }),
      undefined
    );
    emailVerificationUrl = mockSendVerificationEmail.mock.calls
      .at(0)
      ?.at(0)?.url;
    expect(emailVerificationUrl).toBeDefined();
  });

  it("should not sign up when user already exists", async () => {
    const response = await auth.api.signUpEmail({
      asResponse: true,
      body: {
        email,
        password,
        name,
        callbackURL,
      },
    });
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body?.code).toBe("USER_ALREADY_EXISTS");
  });

  it("should not sign in with unverified email", async () => {
    const response = await auth.api.signInEmail({
      asResponse: true,
      body: { email, password, callbackURL },
    });
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body?.code).toBe("EMAIL_NOT_VERIFIED");
    expect(mockSendVerificationEmail).toHaveBeenCalledTimes(2);
  });

  it("should not verify email with invalid token", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/verify-email?token=INVALID_TOKEN&callbackURL=/dashboard"
    );
    const response = await auth.handler(request);
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      "/dashboard?error=invalid_token"
    );
  });

  it("should verify email", async () => {
    const request = new Request(emailVerificationUrl!);
    const response = await auth.handler(request);
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(callbackURL);
    expect(response.headers.has("Set-Cookie")).toBe(true);

    const setCookieHeader = response.headers.get("Set-Cookie")!;
    const match = setCookieHeader.match(/better-auth\.session_token=([^;]+)/);
    const sessionCookie = match ? `better-auth.session_token=${match[1]}` : "";
    expect(sessionCookie).not.toBe("");
    headers.set("Cookie", sessionCookie);
  });

  it("should have valid session", async () => {
    const session = await auth.api.getSession({ headers });
    expect(session).not.toBeNull();
    expect(session!.user?.email).toBe(email);
  });

  it("should sign out", async () => {
    const response = await auth.api.signOut({
      headers,
      asResponse: true,
    });
    expect(response.ok).toBe(true);
    expect(response.headers.has("Set-Cookie")).toBe(true);
  });

  it("should not sign in with invalid password", async () => {
    const response = await auth.api.signInEmail({
      asResponse: true,
      body: { email, password: "INVALID_PASSWORD", callbackURL },
    });
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body?.code).toBe("INVALID_EMAIL_OR_PASSWORD");
  });

  it("should sign in with valid password", async () => {
    const response = await auth.api.signInEmail({
      asResponse: true,
      body: { email, password, callbackURL },
    });
    expect(response.ok).toBe(true);
    expect(response.headers.has("Set-Cookie")).toBe(true);
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
