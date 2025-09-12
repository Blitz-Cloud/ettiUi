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
  cached: boolean;
  lastCached: string;
}

export const CacheManagerContext = createContext<CacheStatus | undefined>(
  undefined
);

async function checkDBHealth() {
  const labsCount = await db.labs.count();
  const blogCount = await db.blog.count();
  const localStorageInfo: string = localStorage.getItem("cacheStatus") || "";

  const localStorageCacheStatus: CacheStatus =
    localStorageInfo.length > 0
      ? JSON.parse(localStorageInfo)
      : {
          loading: true,
          cached: false,
          lastCached: "",
        };
  let lastCacheTimeLocalStorage = Date.parse(
    localStorageCacheStatus.lastCached
  );
  let lastServerSyncTime;

  let response = await fetch(
    (import.meta.env.DEV
      ? import.meta.env.VITE_BK_SRV_DEV
      : import.meta.env.VITE_BK_SRV_PROD) + "/api/admin/last-sync"
  );
  if (response.ok) {
    lastServerSyncTime = Date.parse(await response.text());
  }

  if (
    localStorageCacheStatus.lastCached.length == 0 ||
    lastCacheTimeLocalStorage < lastServerSyncTime
  ) {
    return false;
  }
  if (labsCount != 0 && blogCount != 0) {
    return true;
  }
  return false;
}

export function CacheManager({ children }: CacheManagerProps) {
  const [cacheStatus, setCacheStatusSTATE] = useState<CacheStatus>({
    loading: true,
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
          lastCached: "",
        };

  useEffect(() => {
    async function cacheCreator() {
      setCacheStatus({
        ...localStorageCacheStatus,
        loading: true,
        cached: false,
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
          lastCached: "",
        });
      }

      response = await fetch(
        (import.meta.env.DEV
          ? import.meta.env.VITE_BK_SRV_DEV
          : import.meta.env.VITE_BK_SRV_PROD) + "/api/admin/last-sync"
      );

      if (response.ok) {
        setCacheStatus({
          ...localStorageCacheStatus,
          loading: false,
          cached: true,
          lastCached: await response.text(),
        });
      } else {
        console.log(response);
        setCacheStatus({
          loading: false,
          cached: false,
          lastCached: "",
        });
      }
    }

    // logica principala
    if (localStorageCacheStatus.cached == false) {
      console.log("Creating local cache");
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
