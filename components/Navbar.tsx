"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b bg-white dark:bg-gray-900">
      <form onSubmit={handleSearch} className="relative w-1/2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search in Drive"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8"
        />
      </form>
    </div>
  );
}

