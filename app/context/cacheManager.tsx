import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { db } from "~/lib/db";
import type { Content } from "~/types/content";

interface CacheManagerProps {
  children: ReactNode;
}

interface CacheStatus {
  loading: boolean;
  error: string;
  cached: boolean;
  lastCached: string;
}

export const CacheManagerContext = createContext<CacheStatus | undefined>(
  undefined
);

// ce trebuie facut

// 1. citit localStorage
// 2. validat si verificat daca exista un cache
// 3. YES localCache exists and the dataBase is not empty -> seteaza state ul
// 4. No localCache doesnt exists ->
// 4.1. Executa requesturile necesare pentru a obtine contentul si create localCache

async function checkDBHealth() {
  const labsCount = await db.labs.count();
  const blogCount = await db.blog.count();
  if (labsCount != 0 && blogCount != 0) {
    return true;
  }
  return false;
}

export function CacheManager({ children }: CacheManagerProps) {
  const [cacheStatus, setCacheStatusSTATE] = useState<CacheStatus>({
    loading: true,
    error: "",
    cached: false,
    lastCached: "",
  });

  const setCacheStatus = useCallback((state: CacheStatus) => {
    setCacheStatusSTATE({ ...state });
    localStorage.setItem("cacheStatus", JSON.stringify({ ...state }));
  }, []);

  const localStorageInfo: string = localStorage.getItem("cacheStatus") || "";

  const localStorageCacheStatus: CacheStatus =
    localStorageInfo.length > 0
      ? JSON.parse(localStorageInfo)
      : {
          loading: true,
          cached: false,
          error: "",
          lastCached: "",
        };

  useEffect(() => {
    async function cacheCreator() {
      setCacheStatus({
        ...localStorageCacheStatus,
        loading: true,
        cached: false,
        error: "",
      });
      // the main logic
      await db.delete({ disableAutoOpen: false });
      console.log("INFO: Local cache is purged, in case it existed");
      console.log("INFO: Start creating localCache");

      let response = await fetch(
        (import.meta.env.DEV
          ? import.meta.env.VITE_BK_SRV_DEV
          : import.meta.env.VITE_BK_SRV_PROD) + "/api/labs/posts"
      );
      if (response.ok) {
        const data: Content[] = await response.json();
        const resp = await db.labs.bulkAdd(data);
        if (resp) {
          console.log("INFO Added " + resp + " labs");
        } else {
          console.log(
            "ERROR An error occurred while trying to add all labs to the localCache\nPlease refresh the window"
          );
          setCacheStatus({
            loading: false,
            cached: false,
            error:
              "An error occurred while trying to add all labs to the localCache",
            lastCached: "",
          });
        }
      } else {
        console.log(
          "ERROR An error occurred while fetching the content please refresh the page"
        );

        setCacheStatus({
          loading: false,
          cached: false,
          error: "An error occurred while fetching the content",
          lastCached: "",
        });
      }
      response = await fetch(
        (import.meta.env.DEV
          ? import.meta.env.VITE_BK_SRV_DEV
          : import.meta.env.VITE_BK_SRV_PROD) + "/api/blog/posts"
      );
      if (response.ok) {
        const data: Content[] = await response.json();
        const resp = await db.blog.bulkAdd(data);
        if (resp) {
          console.log("INFO Added " + resp + " blog posts");
        } else {
          console.log(
            "ERROR An error occurred while trying to add all blog posts to the localCache\nPlease refresh the window"
          );
          setCacheStatus({
            loading: false,
            cached: false,
            error:
              "An error occurred while trying to add all labs to the localCache",
            lastCached: "",
          });
        }
      } else {
        console.log(
          "ERROR An error occurred while fetching the content please refresh the page"
        );

        setCacheStatus({
          loading: false,
          cached: false,
          error: "An error occurred while fetching the content",
          lastCached: "",
        });
      }

      // finally seating the state

      setCacheStatus({
        ...localStorageCacheStatus,
        loading: false,
        cached: true,
        error: "",
      });
    }

    if (
      localStorageCacheStatus.cached == false &&
      localStorageCacheStatus.error.length == 0
    ) {
      console.log("Creating local cache");
      cacheCreator();
    } else if (localStorageCacheStatus.error.length > 0) {
      console.log(
        "ERROR: A problem was detected was detected.\n" +
          localStorageCacheStatus.error +
          "\nRecreating cache now"
      );
      cacheCreator();
    }

    if (localStorageCacheStatus.cached == true) {
      checkDBHealth().then(async (isDBHealthy) => {
        if (!isDBHealthy) {
          console.log("ERROR: Cache is unhealthy. Now recreating.");
          await cacheCreator();
        } else {
          setCacheStatus({ ...localStorageCacheStatus });
        }
      });
    }
  }, []);

  return (
    <CacheManagerContext.Provider value={cacheStatus}>
      {children}
    </CacheManagerContext.Provider>
  );
}
