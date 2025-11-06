import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { db } from "~/lib/db";
import { useContext, useState } from "react";
import { ContentManagerContext } from "~/context/contentManager";
import { X } from "lucide-react";

// Define your form schema using Zod for validation
const formSchema = z.object({
  Year: z.coerce
    .number()
    .min(1, "Year must be at least 1")
    .max(4, "Year must be at most 4"),
  Semester: z.coerce
    .number()
    .min(1, "Semester must be at least 1")
    .max(2, "Semester must be at most 2"),
});

export function CourseSelectionForm() {
  const [state, setS] = useState();
  const contentManager = useContext(ContentManagerContext);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Year: 1,
      Semester: 1,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values.Year * 10 + values.Semester);
    contentManager?.setQuery(
      db.labs
        .where("UniYearAndSemester")
        .equals(values.Year * 10 + values.Semester)
        .toArray()
    );
    document.getElementById("reset")?.classList.remove("hidden");
    document.getElementById("submit")?.classList.add("!hidden");

    // console.log(values);
    // console.log(state);
  }

  return (
    <div className="flex flex-col items-center p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          // Mobile-first: flex-col with vertical space
          // On medium screens (md) and up: flex-row with horizontal space
          className="
          bg-card
            flex flex-col justify-around items-center space-y-4
            md:flex-row md:space-x-4 md:space-y-0
            p-4 border rounded-md shadow-sm w-full
          "
        >
          {/* Year Input */}
          <FormField
            control={form.control}
            name="Year"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel htmlFor="Year">An</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="" // Fixed width for inputs to keep them compact
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Semester Input */}
          <FormField
            control={form.control}
            name="Semester"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel htmlFor="Semester">Semestru</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="" // Fixed width for inputs
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button id="submit" type="submit">
            Aplica filtru
          </Button>
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
        </form>
      </Form>
    </div>
  );
}
