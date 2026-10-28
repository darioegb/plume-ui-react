import { useEffect, useState } from "react";

type Resource<Value> =
  | { status: "loading" }
  | { status: "success"; value: Value }
  | { status: "error" };

export function useResource<Value>(load: () => Promise<Value>): Resource<Value> {
  const [resource, setResource] = useState<Resource<Value>>({ status: "loading" });

  useEffect(() => {
    let active = true;
    void load().then(
      (value) => {
        if (active) setResource({ status: "success", value });
      },
      (error: unknown) => {
        console.error("Could not load demo data.", error);
        if (active) setResource({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [load]);

  return resource;
}
