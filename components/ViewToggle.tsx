"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ViewToggle({
  view,
  setViewAction, // ✅ renamed to avoid Next.js serialization warning
}: {
  view: "grid" | "list";
  setViewAction: (v: "grid" | "list") => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon" // ✅ works because Button is shadcn/ui
        variant={view === "grid" ? "default" : "outline"}
        onClick={() => setViewAction("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={view === "list" ? "default" : "outline"}
        onClick={() => setViewAction("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
