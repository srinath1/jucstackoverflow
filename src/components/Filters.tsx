"use client";
import React from "react";
import { Input } from "@nextui-org/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Chip } from "@nextui-org/react";

const Filters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState("");
  const tag = searchParams.get("tag");
  React.useEffect(() => {
    if (search) {
      setTimeout(() => {
        router.push(`/?search=${search}`);
      }, 300);
    }
  }, [search]);
  return (
    <div className="mt-5">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for questions"
        size="lg"
      />
      <div className="mt-5">
        {tag && (
          <h1>
            Showing Results for tag:{" "}
            <Chip
              className="text-primary"
              color="secondary"
              onClose={() => router.push("/")}
            >
              {tag}
            </Chip>
          </h1>
        )}
      </div>
    </div>
  );
};

export default Filters;
