import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";

// describe.skip("SignupForm", () => {
//   it("renders the signup form", () => {
//     const Stub = createRoutesStub([{ path: "/signup", Component: SignupForm }]);
//     render(<Stub initialEntries={["/signup"]} />);
//     expect(
//       screen.getByRole("heading", { name: /sign up/i })
//     ).toBeInTheDocument();
//     expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
//     expect(
//       screen.getByRole("button", { name: /sign up/i })
//     ).toBeInTheDocument();
//   });
// });
