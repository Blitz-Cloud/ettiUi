import { AlertCircleIcon, Divide, Loader2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import type { Route } from "../+types/root";
// import useCachedContent from "~/hooks/useCachedContent";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect, useState } from "react";
import { db } from "~/lib/db";
import { Link } from "react-router";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Content } from "~/types/content";
import { useForm } from "react-hook-form";
import { CourseSelectionForm } from "~/components/aiForm";
import { ContentManagerContext } from "~/context/contentManager";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {}

export default function posts({ params }: Route.ComponentProps) {
  const contentManager = useContext(ContentManagerContext);
  useEffect(() => {
    contentManager?.setPostType(params.postType || "");
    contentManager?.setQuery(undefined);
  }, [params.postType]);

  return (
    <div>
      <div className="h-[175px] flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl">
          {params.postType === "blog" && "Blog"}
          {params.postType === "labs" && "Laboratoare"}
        </h1>
        <p className="mx-2 leading-7">
          {params.postType === "blog" &&
            `
              Aici se gasesc articolele pe care le am scris. Unele din ele sunt
              in gluma alte nu. Oricum ar fi fiecare dintre ele prezinta o
              problema pe care am intampinat o la un moment dat.`}
          {params.postType === "labs" &&
            "Aici se gasesc solutiile problemelor de la laborator. Unele dintre ele pot fi corecte altele nu, de asemenea uneori poate o problema poate fi rezolvata mult mai simplu."}
        </p>
      </div>

      {contentManager?.loading == true || contentManager === undefined ? (
        <div className="flex justify-center">
          <Loader2Icon className="animate-spin" />
          <p className="ml-1">Se incarca articolele</p>
        </div>
      ) : (
        <>
          <CourseSelectionForm />
          <div className="grid sm:grid-cols-1 md:grid-cols-2 sm:gap-3 gap-6 px-2">
            {contentManager?.queriedContent &&
              contentManager.queriedContent.map((data) => {
                return (
                  <Link to={"/" + params.postType + "/post/" + data.ID}>
                    <Card className="min-h-[150px]">
                      <CardHeader>
                        <CardTitle>{data.Title}</CardTitle>
                        <CardDescription>{data.Description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </>
      )}
      {contentManager?.error && contentManager?.error.length != 0 ? (
        <div className="flex justify-center">
          <Alert variant="destructive" className="w-[250px]">
            <AlertCircleIcon />
            <AlertTitle>A fost intampinata o eroare</AlertTitle>
          </Alert>
        </div>
      ) : null}
    </div>
  );
}
