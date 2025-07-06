import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import type { Route } from "./+types/home";
import { Navigate, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertTitle } from "~/components/ui/alert";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Callback() {
  const IsAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const redirectLocation = localStorage.getItem("from");
  useEffect(() => {
    if (IsAuthenticated) {
      instance.setActiveAccount(accounts[0]);
      if (redirectLocation) {
        localStorage.removeItem("from");
        navigate(redirectLocation);
      } else {
        localStorage.removeItem("from");
        navigate("/home");
      }
    } else {
      navigate("/auth");
    }
  }, []); //Add redirectLocation to the dependency array

  return (
    <div className="h-[100vh] flex justify-center items-center ">
      <div className="flex justify-center">
        <Loader2Icon className="animate-spin" />
        <p className="ml-2">Vei fi redirectionat curand</p>
      </div>
    </div>
  );
}
