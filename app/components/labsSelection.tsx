import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { db } from "~/lib/db";
import { useContext } from "react";
import { ContentManagerContext } from "~/context/contentManager";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
const items = [
  {
    id: "pclp1",
    label: "PCLP1",
  },
  {
    id: "pclp2",
    label: "PCLP2",
  },
  {
    id: "sda",
    label: "SDA",
  },
//   {
//     id:"all",
//     label:"ALL"
//   }
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function LabsForm() {
  const contentManager = useContext(ContentManagerContext);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["sda"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data.items)
    contentManager?.setQuery(
       db.labs.where("Subject").anyOf(data.items).toArray() 
    )
    document.getElementById("reset")?.classList.remove("hidden");
    document.getElementById("submit")?.classList.add("!hidden");
  }

  return (
    <Accordion type="single" collapsible className="px-2">
      <AccordionItem value="item-1">
        <AccordionTrigger>Materii</AccordionTrigger>
        <AccordionContent>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 "
            >
              <FormField
                control={form.control}
                name="items"
                render={() => (
                  <FormItem className="flex">
                    
                    {items.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="items"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-center gap-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>

              <Button id="submit" type="submit">Submit</Button> 
              <Button
            className="hidden"
            id="reset"
            onClick={() => {
              document.getElementById("submit")?.classList.remove("!hidden");
              document.getElementById("reset")?.classList.add("hidden");
              console.log("BTN clicked");
              console.log(contentManager?.postType);
              contentManager?.setQuery(db.labs.toArray());
            }}
            variant="destructive"
            type="button"
          >
            <div className="flex items-center">
              <X className=""></X>
              <p>Sterge filtrul</p>
            </div>
          </Button>
              </div>
            </form>
          </Form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
