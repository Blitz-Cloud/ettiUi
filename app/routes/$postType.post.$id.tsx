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
import type { Content } from "~/types/content";

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
  const [contentApi, setContent] = useState<Content>();
  let dateString: string;
  useEffect(() => {
    fetch(
      (import.meta.env.DEV
        ? import.meta.env.VITE_BK_SRV_DEV
        : import.meta.env.VITE_BK_SRV_PROD) +
        "/api/" +
        params.postType +
        "/post/" +
        params.id,
      {
        headers: {
          Authorization: "Bearer " + accounts[0].idToken,
        },
      }
    ).then(async (resp) => {
      resp = await resp.json();
      let out: string;
      out = resp.Content;
      // fix for latex in markdown
      out = out.replaceAll("\\(", "$");
      out = out.replaceAll("\\)", "$");
      resp.Content = out;
      let parsedDate = Date.parse(resp.Date);
      let date = new Date(parsedDate);
      resp.PrettyDate =
        date.getUTCDate().toString() +
        ":" +
        (date.getUTCMonth() + 1) +
        ":" +
        date.getUTCFullYear();

      console.log(resp);
      setContent(resp);
    });
  }, []);
  return (
    <>
      <AuthenticatedTemplate>
        <NiceLayout>
          <Navbar></Navbar>
          <div className="prose max-w-screen px-2">
            <h1 className="text-center h-full">{contentApi?.Title}</h1>
            <p>{contentApi?.PrettyDate}</p>
            {contentApi && <MarkdownRenderer content={contentApi.Content} />}
          </div>
        </NiceLayout>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Navigate to={"/auth?from=" + location.pathname}></Navigate>
      </UnauthenticatedTemplate>
    </>
  );
}
