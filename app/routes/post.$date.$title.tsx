import { useEffect } from "react";
import type { Route } from "./+types/home";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from "@azure/msal-react";
import { Navigate, useLocation, useNavigate } from "react-router";
import NiceLayout from "~/components/niceLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ actionData, params }: Route.ComponentProps) {
  const location = useLocation();
  console.log(location);
  return (
    <>
      <AuthenticatedTemplate>
        <NiceLayout>
          <h1>{params.title}</h1>
        </NiceLayout>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Navigate to={"/auth?from=" + location.pathname}></Navigate>
      </UnauthenticatedTemplate>
    </>
  );
}
