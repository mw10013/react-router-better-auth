import { auth } from "~/lib/auth";
import type { Route } from "./+types/_index";

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
    <main style={{ padding: 32 }}>
      <h1>Loader Data</h1>
      <pre style={{ background: "#f5f5f5", padding: 16, borderRadius: 8 }}>
        {JSON.stringify(props, null, 2)}
      </pre>
    </main>
  );
}
