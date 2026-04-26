"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function HealthScore() {
  const groups = useLiveQuery(() => db.groups.toArray());
  const members = useLiveQuery(() => db.members.toArray());
  const expenses = useLiveQuery(() => db.expenses.toArray());

  if (groups === undefined || members === undefined || expenses === undefined) {
    return null;
  }

  // MVP: Simplified Health Score Calculation
  // We'll calculate a score out of 100 based on how "balanced" debts are across all groups.
  let totalImbalance = 0;
  let totalVolume = 0;

  if (expenses.length > 0 && members.length > 0) {
    const balances: Record<string, number> = {};
    members.forEach((m) => (balances[m.id] = 0));

    expenses.forEach((exp) => {
      totalVolume += exp.amount;
      if (balances[exp.payerId] !== undefined) {
        balances[exp.payerId] += exp.amount;
      }
      exp.splits.forEach((split) => {
        if (balances[split.memberId] !== undefined) {
          balances[split.memberId] -= split.amount;
        }
      });
    });

    Object.values(balances).forEach((bal) => {
      totalImbalance += Math.abs(bal);
    });
  }

  // If there's no volume, score is 100 (perfectly balanced).
  // Otherwise, imbalance as a percentage of total volume. (Imbalance is double counted, so /2)
  const actualImbalance = totalImbalance / 2;
  const imbalanceRatio = totalVolume > 0 ? actualImbalance / totalVolume : 0;
  
  // Base score 100, subtract penalty for imbalance.
  const score = expenses.length === 0 ? 0 : Math.max(0, Math.round(100 - (imbalanceRatio * 100)));

  return (
    <Card className="bg-indigo-950/20 border-indigo-500/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-indigo-400">
          Global Financial Health
        </CardTitle>
        <Activity className="h-4 w-4 text-indigo-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-indigo-950/50"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-indigo-500"
                strokeDasharray={`${score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
              {score}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {score === 0 && expenses.length === 0
                ? "Start adding expenses to see your score."
                : score > 80
                ? "Your groups are highly balanced. Debts are settled frequently."
                : "Your groups have high outstanding debts. Settle up to improve."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
