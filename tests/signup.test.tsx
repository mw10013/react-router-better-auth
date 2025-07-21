import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import RouteComponent from "../app/routes/signup";
import { describe, it, expect, beforeAll } from "vitest";

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
