import { auth } from "~/lib/auth";
import type { Route } from "./+types/_index";
import { Link } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });
  return { user: session?.user ?? null };
}

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function RouteComponent(props: Route.ComponentProps) {
  return (
    <main className="p-8">
      {!props.loaderData?.user && (
        <div className="mb-6 flex justify-center">
          <Link
            to="/signup"
            className="inline-block rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </Link>
        </div>
      )}
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        {JSON.stringify(props, null, 2)}
      </pre>
    </main>
  );
}
