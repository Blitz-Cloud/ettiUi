import type { Route } from "../+types/root";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Navigate, useLocation, useNavigate } from "react-router";
import NiceLayout from "~/components/niceLayout";
import MarkdownRenderer from "~/components/markdownRenderer";
import { useEffect, useState } from "react";
import Navbar from "~/components/navbar";
export default function PlatformPlan({ params }: Route.ComponentProps) {
  return (
    <div>
      <NiceLayout>
        <Navbar />
        <div className="prose prose-h1:text-center max-w-svw mt-10">
          <MarkdownRenderer
            content={`# Salut aici poti gasi detalii despre aceasta platforma
              `}
          />
        </div>
      </NiceLayout>
    </div>
  );
}
