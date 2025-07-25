import type { Route } from "../+types/root";
import MarkdownRenderer from "~/components/markdownRenderer";
import type { Content } from "~/types/content";
import { db } from "~/lib/db";
import { Calendar, Contact } from "lucide-react";
import { useContext, useEffect } from "react";
import { ContentManagerContext } from "~/context/contentManager";

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

// export async function clientLoader({ params }: Route.ClientLoaderArgs) {
//   console.log(params.id);
//   switch (params.postType) {
//     case "labs":
//       return await db.labs
//         .where("ID")
//         .equals(ID)
//         .toArray()
//         .then((data) => {
//           return data;
//         });
//       break;
//     case "blog":
//       return await db.blog
//         .where("ID")
//         .equals(ID)
//         .toArray()
//         .then((data) => {
//           // FIX do not touch. Este o solutie care ar fi trebuit sa fie temporara insa deoarece atunci cand augmentezi md cu latex este posibil sa apara latex inline acesta solutie rezolva problemele de afisare care pot aparea
//           data[0].Content = data[0].Content.replaceAll("\\(", "$");
//           data[0].Content = data[0].Content.replaceAll("\\)", "$");
//           return data;
//         });
//       break;
//     default:
//       return "";
//       break;
//   }
// }

export default function Post({ params, loaderData }: Route.ComponentProps) {
  const contentManager = useContext(ContentManagerContext);
  let data: Content[] | undefined;
  useEffect(() => {
    const ID: number = Number(params.id);
    contentManager?.setPostType(params.postType || "lab");
    switch (params.postType) {
      case "labs":
        contentManager?.setQuery(db.labs.where("ID").equals(ID).toArray());
        break;
      case "blog":
        contentManager?.setQuery(db.blog.where("ID").equals(ID).toArray());
        // FIX do not touch. Este o solutie care ar fi trebuit sa fie temporara insa deoarece atunci cand augmentezi md cu latex este posibil sa apara latex inline acesta solutie rezolva problemele de afisare care pot aparea
        // data[0].Content = data[0].Content.replaceAll("\\(", "$");
        // data[0].Content = data[0].Content.replaceAll("\\)", "$");
        break;
      default:
        break;
    }
    data = contentManager?.queriedContent;
    // console.log(data);
    console.log(contentManager?.queriedContent);
  }, []);
  // // if (data?.length != 0) {
  // //   data[0].Content = data[0].Content.replaceAll("\\(", "$");
  // //   data[0].Content = data[0].Content.replaceAll("\\)", "$");
  // // }

  if (contentManager?.queriedContent) {
    const date = new Date(contentManager?.queriedContent[0].Date);
    return (
      <div className="prose max-w-screen px-2">
        <h1 className="text-slate-900 mb-0">
          {contentManager?.queriedContent[0]?.Title}
        </h1>
        <p className="w-[350x] mt-0 flex items-center">
          <Calendar className="mx-3" />
          {date.getUTCDate() +
            ":" +
            (date.getUTCMonth() + 1) +
            ":" +
            date.getFullYear()}
        </p>
        {contentManager?.queriedContent[0] && (
          <MarkdownRenderer
            content={contentManager.queriedContent[0].Content}
          />
        )}
      </div>
      // <div>hello world</div>
    );
  }
}
