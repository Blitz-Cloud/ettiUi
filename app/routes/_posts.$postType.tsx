import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useAccount,
  useMsal,
} from "@azure/msal-react";
import { AlertCircleIcon, Divide, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import NiceLayout from "~/components/niceLayout";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "~/components/ui/card";
import type { Route } from "../+types/root";

interface DataFetcher {
  inProgress: Boolean;
  error: string;
  content: any;
}
export default function posts({ params }: Route.ComponentProps) {
  const [data, setData] = useState<DataFetcher>({
    inProgress: true,
    content: null,
    error: "",
  });
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => {
    instance
      .acquireTokenSilent({
        scopes: ["User.Read"],
        account: account || undefined,
      })
      .then((response) => {
        response.idToken;
        fetch("http://localhost:3000/api/" + params.postType, {
          headers: {
            Authorization: "Bearer " + account?.idToken,
          },
        })
          .then(async (response) => {
            const data = await response.json();
            console.log(data);
            setData({ inProgress: false, content: data, error: "" });
          })
          .catch((error) => {
            console.log("Error " + error);
            setData((preData) => ({
              ...preData,
              inProgress: false,
              error: error,
            }));
          });
      });
  }, []);

  return (
    <div>
      <UnauthenticatedTemplate>
        <Navigate to="/auth?from=/posts" />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <NiceLayout>
          <div className="h-[150px] flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl">Blog</h1>
            <p className="mt-2 leading-7">
              Aici se gasesc articolele pe care le am scris. Unele din ele sunt
              in gluma alte nu. Oricum ar fi fiecare dintre ele prezinta o
              problema pe care am intampinat o la un moment dat.
            </p>
          </div>

          {data.inProgress ? (
            <div className="flex justify-center">
              <Loader2Icon className="animate-spin" />
              <p className="ml-1">Se incarca articolele</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 sm:gap-3 gap-6 ">
              {data.content &&
                data.content.map((data) => {
                  return (
                    <a href={"/post/" + data.Date + "/" + data.Title}>
                      <Card className="min-h-[150px]">
                        <CardHeader>
                          <CardTitle>{data.Title}</CardTitle>
                          <CardDescription>{data.Description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </a>
                  );
                })}
            </div>
          )}
          {data.inProgress === false && data.error.length != 0 ? (
            <div className="flex justify-center">
              <Alert variant="destructive" className="w-[250px]">
                <AlertCircleIcon />
                <AlertTitle>A fost intampinata o eroare</AlertTitle>
                {/* <AlertDescription>
                  <p></p>
                  <ul className="list-inside list-disc text-sm">
                    <li>Check your card details</li>
                    <li>Ensure sufficient funds</li>
                    <li>Verify billing address</li>
                  </ul>
                </AlertDescription> */}
              </Alert>
            </div>
          ) : null}
        </NiceLayout>
      </AuthenticatedTemplate>
    </div>
  );
}
