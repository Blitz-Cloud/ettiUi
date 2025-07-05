import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import type { Route } from "./+types/home";
import { Navigate, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertTitle } from "~/components/ui/alert";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Callback() {
  const { instance, accounts } = useMsal();
  const [errorMessage, setErrorMessage] = useState<String>();
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  // Capture redirectLocation outside of useEffect
  const redirectLocation = localStorage.getItem("from");
  const allowAccess = localStorage.getItem("allowAccess");

  useEffect(() => {
    if (
      accounts.length != 0 &&
      accounts[0].username.split("@")[1].includes("etti.upb.ro")
    ) {
      setErrorMessage("Acesta nu este un cont valid de student la etti");
      setTimeout(() => {
        navigate("/auth");
        instance.clearCache();
        return;
      }, 3000);
    } else if (accounts.length == 0) {
      navigate("/auth");
      return;
    }

    if (redirectLocation) {
      localStorage.removeItem("from");
      navigate(redirectLocation);
    } else {
      localStorage.removeItem("from");
      navigate("/home");
    }
  }, [navigate, redirectLocation]); //Add redirectLocation to the dependency array

  return (
    <div className="h-[100vh] flex justify-center items-center ">
      <div className="flex justify-center">
        <Loader2Icon className="animate-spin" />
        {!errorMessage && <p className="ml-2">Vei fi redirectionat curand</p>}
        {errorMessage && (
          <Alert>
            <AlertTitle>{errorMessage}</AlertTitle>
          </Alert>
        )}
      </div>
    </div>
  );
}
