import { Loader2Icon } from "lucide-react";
import type { Route } from "./+types/home";
import { Navigate, useNavigate } from "react-router";
import { useEffect, useRef } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Callback() {
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  // Capture redirectLocation outside of useEffect
  const redirectLocation = localStorage.getItem("from");

  useEffect(() => {
    if (hasNavigated.current) {
      return; // Prevent navigation on subsequent renders
    }

    hasNavigated.current = true; // Set ref to indicate navigation

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
        <p className="ml-2">Vei fi redirectionat curand</p>
      </div>
    </div>
  );
}
