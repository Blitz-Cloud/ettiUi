import { Link, Outlet } from "react-router";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { Outdent } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center ">
      <div className="text-center">
        <h1 className="font-bold text-4xl">Bine ai venit</h1>
        <p>Aceasta pagina este inca in constructie </p>
        <Outlet />
        <Button variant="outline" className="mt-2">
          <Link to="/auth">Autentificate</Link>
        </Button>
      </div>
    </div>
  );
}
