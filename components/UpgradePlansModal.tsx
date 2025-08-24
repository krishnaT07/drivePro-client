"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UpgradePlansModal({
  open,
  onOpenChangeAction,
  onRefetchQuotaAction,
  userId,
}: {
  open: boolean;
  onOpenChangeAction: (v: boolean) => void;
  onRefetchQuotaAction: () => void;
  userId?: string;
}) {
  const plans = [
    { id: "basic", name: "Basic", price: "$5/mo", storage: "100GB" },
    { id: "pro", name: "Pro", price: "$10/mo", storage: "1TB" },
    { id: "ultimate", name: "Ultimate", price: "$20/mo", storage: "5TB" },
  ];

  const handleUpgrade = async (planId: string) => {
    // Call backend upgrade API here
    alert(`✅ Subscribed to ${planId} plan`);
    onRefetchQuotaAction();   // ✅ updated name
    onOpenChangeAction(false); // ✅ updated name
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-500">
                  {plan.storage} • {plan.price}
                </p>
              </div>
              <Button onClick={() => handleUpgrade(plan.id)}>Choose</Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
