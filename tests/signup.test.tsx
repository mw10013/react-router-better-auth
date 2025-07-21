import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import RouteComponent from "../app/routes/signup";
import { describe, it, expect, beforeAll } from "vitest";
import { resetTestDb } from "./test-utils";
import { action } from "../app/routes/signup";

describe("Sign Up", () => {
  it("renders the signup form", () => {
    const Stub = createRoutesStub([
      { path: "/signup", Component: RouteComponent },
    ]);
    render(<Stub initialEntries={["/signup"]} />);
    expect(
      screen.getByRole("heading", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });
});

describe("signup action", () => {
  beforeAll(() => {
    resetTestDb();
  });
  it("redirects to / and sets cookie on successful signup", async () => {
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

    // Try to sign up again with the same email/password
    const dupForm = new FormData();
    dupForm.append("email", email);
    dupForm.append("password", password);
    const dupRequest = new Request("http://localhost/signup", {
      method: "POST",
      body: dupForm,
    });
    const dupResult = await action({ request: dupRequest });
    expect(dupResult.status).toBe(302);
    expect(dupResult.headers.get("location")).toBe("/signin");
  });
});
