import type { Route } from "./+types/signup";
import { Form } from "react-router";
import { auth } from "../lib/auth";
import { redirect } from "react-router";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid form data");
  }
  const response = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: "",
    },
    asResponse: true,
  });
  if (!response.ok) return response;
  return redirect("/", { headers: response.headers });
}

export default function RouteComponent() {
  return (
    <Form
      method="post"
      className="mx-auto w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 shadow-lg p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Sign Up
      </h2>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 outline-none"
          autoComplete="email"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 outline-none"
          autoComplete="new-password"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign Up
      </button>
    </Form>
  );
}
