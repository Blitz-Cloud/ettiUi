import React, {
  createContext,
  useCallback,
  useContext,
  useDebugValue,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CacheManagerContext } from "./cacheManager";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "~/lib/db";
import type { Content } from "~/types/content";
import type { PromiseExtended } from "dexie";

export interface ContentManagerProps {
  loading: boolean;
  error: string | null;
  queriedContent: Content[] | undefined;
  postType: string | "";
  setPostType: (postType: string) => void;
  setQuery: (queryPromise: PromiseExtended<Content[]> | undefined) => void;
}

export const ContentManagerContext = createContext<
  ContentManagerProps | undefined
>(undefined);

interface ContentProviderProps {
  children: ReactNode;
}

export function ContentManager({ children }: ContentProviderProps) {
  const cacheStatus = useContext(CacheManagerContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [postType, setPostType] = useState<string | undefined>(undefined);
  const [queryPromise, setQueryPromise] = useState<
    PromiseExtended<Content[]> | undefined
  >(undefined);

  useEffect(() => {
    setLoading(cacheStatus?.loading || false);
    // setError(cacheStatus?.error || null);
  }, [cacheStatus?.loading]);

  const getQueryPromise = useCallback(() => {
    if (queryPromise !== undefined) {
      return queryPromise;
    } else {
      switch (postType) {
        case "labs":
          return db.labs.toArray();
          break;
        case "blog":
          return db.blog.toArray();
        default:
          return db.labs.toArray();
      }
    }
  }, [queryPromise, postType]);

  const queriedContent = useLiveQuery(getQueryPromise, [
    queryPromise,
    postType,
  ]);
  const contextValues = useMemo<ContentManagerProps>(
    () => ({
      loading: loading,
      error: error,
      queriedContent: queriedContent,
      postType: postType || "",
      setPostType: setPostType,
      setQuery: setQueryPromise,
    }),
    [loading, error, queriedContent, postType, setPostType, setQueryPromise]
  );

  useEffect(() => {}, [postType, queriedContent]);

  return (
    <ContentManagerContext.Provider value={{ ...contextValues }}>
      {children}
    </ContentManagerContext.Provider>
  );
}
