"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import UpgradePlansModal from "@/components/UpgradePlansModal";
import { useState } from "react";
import Link from "next/link";

async function fetchQuota() {
  const res = await api.get("/users/quota");
  return res.data;
}

export default function Sidebar() {
  const { data, refetch } = useQuery({ queryKey: ["quota"], queryFn: fetchQuota });
  const [open, setOpen] = useState(false);

  const usedGB = (data?.used || 0) / (1024 * 1024 * 1024);
  const totalGB = (data?.limit || 1) / (1024 * 1024 * 1024);
  const percent = ((data?.used || 0) / (data?.limit || 1)) * 100;

  return (
    <div className="w-64 border-r p-4 flex flex-col justify-between">
      {/* Navigation */}
      <Link href="/billing" className="block text-sm text-gray-600 hover:underline mt-2">
        Billing History
      </Link>

      {/* Quota tracking */}
      <div className="mt-auto">
        <p className="text-xs mb-1">
          {usedGB.toFixed(2)} GB of {totalGB.toFixed(0)} GB used
        </p>
        <Progress value={percent} className="h-2 mb-2" />
        <Button className="w-full" onClick={() => setOpen(true)}>
          Upgrade Storage
        </Button>
      </div>

      {/* Upgrade Modal */}
      <UpgradePlansModal
        open={open}
        onOpenChangeAction={setOpen}       // ✅ matches modal prop
        onRefetchQuotaAction={refetch}     // ✅ matches modal prop
        userId={data?.userId}
      />
    </div>
  );
}



