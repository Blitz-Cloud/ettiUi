import { createContext, useEffect, useState, type ReactNode } from "react";
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

export function CacheManager({ children }: CacheManagerProps) {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    loading: true,
    error: "",
    cached: false,
    lastCached: "",
  });
  const localStorageStatus: string = localStorage.getItem("cacheStatus") || "";
  const localStorageCacheStatus: CacheStatus =
    localStorageStatus.length !== 0 ? JSON.parse(localStorageStatus) : {};

  useEffect(() => {
    async function cacheCreator() {
      await db
        .delete({ disableAutoOpen: false })
        .then(() => {
          console.log("INFO: Local cache is purged, in case it existed");
        })
        .catch((err) => {
          console.log(
            "ERROR: An error occurred while trying to delete localCache\nPlease refresh the window\nError log:\n" +
              err
          );
          setCacheStatus({ ...cacheStatus, loading: false, error: err });
        });

      console.log("INFO: Start creating localCache");
      setCacheStatus({ ...cacheStatus, loading: true });
      // purging the localCache in case it exists, preventing duplicating data, and weird behavior
      await db
        .delete({ disableAutoOpen: false })
        .then(() => {
          console.log("INFO: Local cache is purged, in case it existed");
        })
        .catch((err) => {
          console.log(
            "ERROR: An error occurred while trying to delete localCache\nPlease refresh the window\nError log:\n" +
              err
          );
          setCacheStatus({ ...cacheStatus, loading: false, error: err });
        });

      await fetch(
        (import.meta.env.DEV
          ? import.meta.env.VITE_BK_SRV_DEV
          : import.meta.env.VITE_BK_SRV_PROD) + "/api/labs/posts"
      )
        .then(async (resp) => {
          const data: Content[] = await resp.json();
          db.labs
            .bulkAdd(data)
            .then((data) => {
              console.log("INFO Added " + data + " labs");
            })
            .catch((err) => {
              console.log(
                "ERROR An error occurred while trying to add all entries to the localCache\nError log:" +
                  err
              );
              setCacheStatus({ ...cacheStatus, loading: false, error: err });
            });
        })
        .catch((err) => {
          console.log(
            "ERROR An error occurred while fetching the content please refresh the page\nError log:\n" +
              err
          );

          setCacheStatus({ ...cacheStatus, loading: false, error: err });
        });

      await fetch(
        (import.meta.env.DEV
          ? import.meta.env.VITE_BK_SRV_DEV
          : import.meta.env.VITE_BK_SRV_PROD) + "/api/blog/posts"
      )
        .then(async (resp) => {
          const data: Content[] = await resp.json();
          db.blog
            .bulkAdd(data)
            .then((data) => {
              console.log("INFO Added " + data + " blog posts");
            })
            .catch((err) => {
              console.log(
                "ERROR An error occurred while trying to add all entries to the localCache\nError log:" +
                  err
              );
              setCacheStatus({ ...cacheStatus, loading: false, error: err });
            });
        })
        .catch((err) => {
          console.log(
            "ERROR An error occurred while fetching the content please refresh the page\nError log:\n" +
              err
          );

          setCacheStatus({ ...cacheStatus, loading: false, error: err });
        });
      localStorage.setItem(
        "cacheStatus",
        JSON.stringify({ ...cacheStatus, loading: false, cached: true })
      );
      setCacheStatus({
        ...cacheStatus,
        loading: false,
        cached: true,
      });
    }

    if (
      localStorageStatus?.length == 0 ||
      localStorageCacheStatus.cached == false
    ) {
      cacheCreator();
    } else {
      setCacheStatus({ ...localStorageCacheStatus });
    }
  }, []);

  return (
    <CacheManagerContext.Provider value={cacheStatus}>
      {children}
    </CacheManagerContext.Provider>
  );
}
