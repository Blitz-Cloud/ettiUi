import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Etti Helper Home" },
    { name: "description", content: "Pagina principala a site ului" },
  ];
}

export default function Home() {
  return <Welcome />;
}
