import type { Route } from "../+types/root";
import MarkdownRenderer from "~/components/markdownRenderer";
import type { Content } from "~/types/content";
import { db } from "~/lib/db";
import { Calendar, ClipboardCopy, Computer } from "lucide-react";
import { useContext, useEffect } from "react";
import { ContentManagerContext } from "~/context/contentManager";
import { Button } from "~/components/ui/button";

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

function getPrettyDate(date: Date): string {
  date = new Date(date);
  const day = (date.getUTCDate()).toLocaleString().padStart(2,"0")
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}_${month}_${year}`;
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
  }, []);

  if (contentManager.queriedContent.length !=0) {
    const date = new Date(contentManager.queriedContent[0].Date);
    return (
      <div className="prose dark:prose-invert max-w-screen px-2">
        <h1 className=" mb-0">{contentManager.queriedContent[0]?.Title}</h1>
        <p className="w-[350x] mt-0 flex items-center">
          <Calendar className="mx-3" />
          {date.getUTCDate() +
            ":" +
            (date.getUTCMonth() + 1) +
            ":" +
            date.getFullYear()}
        </p>
        
        {contentManager.queriedContent[0].Subject !=""?
        (
        <div className="">
        <Button className="m-1"  onClick={()=>{
         let string = 
        `ettiWatcher open https://github.com/Blitz-Cloud/ettiContent /${contentManager.queriedContent[0].Subject}/${contentManager.queriedContent[0].Title.replaceAll(" ","_")}-${contentManager.queriedContent[0].UniYearAndSemester}-${getPrettyDate(contentManager.queriedContent[0].Date)}`
         console.log(string) 
          navigator.clipboard.writeText(string)
        }}> 
        
        <Computer/>
        
        Open in code editor</Button>
        <Button className="m-1" onClick={()=>{
          let content= contentManager.queriedContent[0].Content
          let codeExample = content.slice(content.indexOf("\n", content.indexOf("```")),content.indexOf("```\n"))
          console.log(codeExample)
          console.log("Code copied")
          navigator.clipboard.writeText(codeExample)
        }}>
          <ClipboardCopy/>
          Copiaza codul in clipboard 
        </Button>
        </div>


        ):""  
      
      
      }
      {contentManager?.queriedContent[0] && (
        <MarkdownRenderer
          content={contentManager.queriedContent[0].Content}
        />
      )}
      </div>
    );
  }
}
