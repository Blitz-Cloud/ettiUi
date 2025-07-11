import { useEffect, useState } from "react";
import type { Route } from "../+types/root";
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
import Navbar from "~/components/navbar";

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

export default function Home({ params }: Route.ComponentProps) {
  const { accounts, instance, inProgress } = useMsal();
  const [contentApi, setContent] = useState<String>();

  useEffect(() => {
    fetch(
      (import.meta.env.DEV
        ? import.meta.env.VITE_BK_SRV_DEV
        : import.meta.env.VITE_BK_SRV_PROD) +
        "/api/" +
        params.postType +
        "/post/" +
        params.date +
        "/" +
        params.title,
      {
        headers: {
          Authorization: "Bearer " + accounts[0].idToken,
        },
      }
    ).then(async (resp) => {
      resp = await resp.json();
      console.log(resp);
      let out: string;
      out = resp.Content;
      out = out.replaceAll("\\(", "$");
      out = out.replaceAll("\\)", "$");
      console.log(out);
      setContent(out);
    });
  }, []);
  return (
    <>
      <AuthenticatedTemplate>
        <NiceLayout>
          <Navbar></Navbar>
          <div className="prose max-w-screen px-2">
            <h1 className="text-center h-full">{params.title}</h1>
            <p>{params.date}</p>
            {contentApi && <MarkdownRenderer content={contentApi} />}
          </div>
        </NiceLayout>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Navigate to={"/auth?from=" + location.pathname}></Navigate>
      </UnauthenticatedTemplate>
    </>
  );
}
