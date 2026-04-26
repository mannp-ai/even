"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db, Member } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddExpenseDialog({ groupId, members, children }: { groupId: string; members: Member[]; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payerId, setPayerId] = useState(members[0]?.id || "");

  const handleAdd = async () => {
    if (!description.trim() || !amount || isNaN(Number(amount)) || !payerId || members.length === 0) return;

    const parsedAmount = Number(amount);
    const splitAmount = parsedAmount / members.length;

    const splits = members.map((m) => ({
      memberId: m.id,
      amount: splitAmount,
      type: "EQUAL" as const,
    }));

    const newExpense = {
      id: uuidv4(),
      groupId,
      description: description.trim(),
      amount: parsedAmount,
      payerId,
      date: Date.now(),
      splits,
    };

    await db.expenses.add(newExpense);
    setOpen(false);
    setDescription("");
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={(children as React.ReactElement) || <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Add Expense</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Enter details. It will be split equally among all {members.length} members.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="e.g. Dinner"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (₹)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payer" className="text-right">
              Paid by
            </Label>
            <select
              id="payer"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!description.trim() || !amount || !payerId || members.length === 0}>
            Save Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
