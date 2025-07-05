import { useEffect } from "react";
import type { Route } from "./+types/home";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import { Navigate, useLocation, useNavigate } from "react-router";
import NiceLayout from "~/components/niceLayout";
import MarkdownRenderer from "~/components/markdownRenderer";
import { getIdToken } from "~/api/getIdToken";

interface ParamsType {
  date: string;
  title: string;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ params }: ParamsType) {
  const { accounts, instance, inProgress } = useMsal();
  // console.log(accounts[0].username);
  useEffect(() => {
    const idToken = getIdToken();
    console.log(idToken);
    fetch("http://localhost:3000/api/posts" + params.date + params.title, {
      headers: {
        Authorization: "",
      },
    });
  }, []);
  return (
    <>
      <AuthenticatedTemplate>
        <NiceLayout>
          <h1>{params.title}</h1>
          {/* <MarkdownRenderer content={markdownContent} /> */}
        </NiceLayout>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Navigate to={"/auth?from=" + location.pathname}></Navigate>
      </UnauthenticatedTemplate>
    </>
  );
}
