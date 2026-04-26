import Dexie, { type Table } from 'dexie';

export interface Group {
  id: string;
  name: string;
  emoji?: string;
  createdAt: number;
}

export interface Member {
  id: string;
  groupId: string;
  name: string;
}

export interface Split {
  memberId: string;
  amount: number;
  type: 'EQUAL' | 'EXACT' | 'PERCENTAGE' | 'SHARES';
  value?: number; // percentage value or shares
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  payerId: string;
  date: number;
  categoryId?: string;
  splits: Split[];
}

export interface Settlement {
  id: string;
  groupId: string;
  fromId: string;
  toId: string;
  amount: number;
  date: number;
}

export class PactDB extends Dexie {
  groups!: Table<Group, string>;
  members!: Table<Member, string>;
  expenses!: Table<Expense, string>;
  settlements!: Table<Settlement, string>;

  constructor() {
    super('PactDatabase');
    this.version(1).stores({
      groups: 'id, createdAt',
      members: 'id, groupId',
      expenses: 'id, groupId, date, payerId',
      settlements: 'id, groupId, date, fromId, toId'
    });
  }
}

export const db = new PactDB();
