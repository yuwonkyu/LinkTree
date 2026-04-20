"use client";

import { useTransition } from "react";
import { changePlan } from "./actions";
import type { Plan } from "@/lib/types";

export default function PlanSelect({ profileId, current }: { profileId: string; current: Plan }) {
  const [pending, start] = useTransition();

  return (
    <select
      disabled={pending}
      defaultValue={current}
      onChange={(e) => start(() => changePlan(profileId, e.target.value as Plan))}
      className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-foreground disabled:opacity-50"
    >
      <option value="free">free</option>
      <option value="basic">basic</option>
      <option value="pro">pro</option>
    </select>
  );
}
