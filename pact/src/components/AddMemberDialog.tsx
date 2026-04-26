"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
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

export function AddMemberDialog({ groupId, children }: { groupId: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;

    const newMember = {
      id: uuidv4(),
      groupId,
      name: name.trim(),
    };

    await db.members.add(newMember);
    setOpen(false);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={(children as React.ReactElement) || <Button variant="secondary">Add Member</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Member</DialogTitle>
          <DialogDescription>
            Add a friend to this group. No phone number or account required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="memberName" className="text-right">
              Name
            </Label>
            <Input
              id="memberName"
              placeholder="e.g. Rahul"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!name.trim()}>
            Add to Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
