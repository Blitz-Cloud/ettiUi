import Dexie, { type EntityTable } from "dexie";
import type { Content } from "~/types/content";

const db = new Dexie("content") as Dexie & {
  labs: EntityTable<
    Content,
    "dexieID" // primary key "id" (for the typings only)
  >;
  blog: EntityTable<
    Content,
    "dexieID" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  labs: "++dexieID, ID, Title, Description, Date, PrettyDate, Subject, Tags, UniYearAndSemester, Content, CodeExample", // primary key "id" (for the runtime!)
  blog: "++dexieID, ID, Title, Description, Date, PrettyDate, Subject, Tags, UniYearAndSemester, Content, CodeExample", // primary key "id" (for the runtime!)
});

export { db };
