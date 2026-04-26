"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Receipt, Plus } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { AddMemberDialog } from "@/components/AddMemberDialog";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { DebtGraph } from "@/components/DebtGraph";
import { formatRupees } from "@/lib/utils";

export default function GroupPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const group = useLiveQuery(() => db.groups.get(id), [id]);
  const members = useLiveQuery(() => db.members.where("groupId").equals(id).toArray(), [id]) || [];
  const expenses = useLiveQuery(() => db.expenses.where("groupId").equals(id).toArray(), [id]);

  if (group === undefined) return <div className="p-8 text-center">Loading...</div>;
  if (group === null) return <div className="p-8 text-center text-red-500">Group not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6 mt-4">
      <Button variant="ghost" className="mb-2 -ml-4" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-2" size={16} /> Back to Groups
      </Button>

      <header className="flex justify-between items-end pb-4 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-4xl">{group.emoji}</span> {group.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {members.length} members · {expenses?.length || 0} expenses
          </p>
        </div>
        <div className="flex gap-2">
          <AddMemberDialog groupId={id}>
            <Button variant="secondary" className="gap-2">
              <Users size={16} /> Add Member
            </Button>
          </AddMemberDialog>
          {members.length > 0 && (
            <AddExpenseDialog groupId={id} members={members}>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus size={16} /> Add Expense
              </Button>
            </AddExpenseDialog>
          )}
        </div>
      </header>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent mb-6">
          <TabsTrigger
            value="expenses"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-6 py-3"
          >
            Expenses
          </TabsTrigger>
          <TabsTrigger
            value="balances"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-6 py-3"
          >
            Balances
          </TabsTrigger>
          <TabsTrigger
            value="graph"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-6 py-3"
          >
            Debt Graph
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          {expenses?.length === 0 ? (
            <Card className="border-dashed bg-transparent border-border">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Receipt className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No expenses yet</h3>
                <p className="text-sm text-muted-foreground mb-4 mt-2 max-w-sm">
                  Add an expense to start splitting the bills.
                </p>
                {members.length > 0 ? (
                  <AddExpenseDialog groupId={id} members={members}>
                    <Button>Add First Expense</Button>
                  </AddExpenseDialog>
                ) : (
                  <AddMemberDialog groupId={id}>
                    <Button>Add Member First</Button>
                  </AddMemberDialog>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {expenses?.sort((a, b) => b.date - a.date).map((expense) => {
                const payer = members.find((m) => m.id === expense.payerId);
                return (
                  <Card key={expense.id} className="hover:bg-muted/30 transition-colors">
                    <CardHeader className="py-4 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{expense.description}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Paid by {payer?.name || "Someone"} · {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-lg font-bold">{formatRupees(expense.amount)}</div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="balances">
          <Card>
            <CardHeader>
              <CardTitle>Group Balances</CardTitle>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-muted-foreground">Add members to see balances.</p>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => {
                    // Calculate basic balances (MVP: very naive calculation)
                    let balance = 0;
                    expenses?.forEach((exp) => {
                      if (exp.payerId === member.id) {
                        balance += exp.amount; // what they paid
                      }
                      const split = exp.splits.find((s) => s.memberId === member.id);
                      if (split) {
                        balance -= split.amount; // what they owe
                      }
                    });

                    return (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                        <div className={`text-sm font-medium ${balance > 0.01 ? "text-emerald-500" : balance < -0.01 ? "text-red-500" : "text-muted-foreground"}`}>
                          {balance > 0.01 ? `Gets back ${formatRupees(balance)}` : balance < -0.01 ? `Owes ${formatRupees(Math.abs(balance))}` : "Settled up"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graph">
          <Card>
            <CardHeader>
              <CardTitle>Debt Graph</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center border border-dashed rounded-md bg-muted/10 overflow-hidden relative">
              <DebtGraph members={members} expenses={expenses || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
