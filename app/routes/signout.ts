import { auth } from "../lib/auth";
import { redirect } from "react-router";

export async function action({ request }: { request: Request }) {
  const response = await auth.api.signOut({
    headers: request.headers,
    asResponse: true,
  });
  if (!response.ok) throw response;
  return redirect("/", { headers: response.headers });
}
