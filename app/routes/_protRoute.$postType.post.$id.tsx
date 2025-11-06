import type { Route } from "../+types/root";
import MarkdownRenderer from "~/components/markdownRenderer";
import type { Content } from "~/types/content";
import { db } from "~/lib/db";
import { Calendar} from "lucide-react";
import { useContext, useEffect } from "react";
import { ContentManagerContext } from "~/context/contentManager";

interface ParamsType {
  date: string;
  title: string;
}

export function meta({params}: Route.MetaArgs) {
  return [
    { title: ""+params.postType+" "+ params.id },
    { name: "description", content: "Welcome to React Router!" },
  ];
}


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
        break;
      default:
        break;
    }
    data = contentManager?.queriedContent;
    console.log(contentManager?.queriedContent);
  }, []);

  if (contentManager?.queriedContent) {
    const date = new Date(contentManager?.queriedContent[0].Date);
    return (
      <div className="prose dark:prose-invert max-w-screen px-2">
        <h1 className=" mb-0">{contentManager?.queriedContent[0]?.Title}</h1>
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
            content={contentManager.queriedContent[0].Content + (params.postType == "labs" ? "```cpp\n": "") + contentManager.queriedContent[0].CodeExample + ( params.postType == "labs" ? "```": "") }
          />
        )}
      </div>
    );
  }
}
