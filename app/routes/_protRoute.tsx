import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import NiceLayout from "~/components/niceLayout";
import Navbar from "~/components/navbar";
import { CacheManager } from "~/context/cacheManager";
import { ContentManager } from "~/context/contentManager";
export default function RouteProtector() {
  return (
    <>
      <UnauthenticatedTemplate>
        <Navigate to={"/auth?from=" + location.pathname}></Navigate>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <NiceLayout>
          <Navbar></Navbar>
          <CacheManager>
            <ContentManager>
              <Outlet />
            </ContentManager>
          </CacheManager>
        </NiceLayout>
      </AuthenticatedTemplate>
    </>
  );
}
