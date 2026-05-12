"use client";

import type { Role } from "@prisma/client";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date | string;
  _count: {
    orders: number;
    inboxMessages: number;
  };
};

export function AdminUsersClient({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => users.filter((user) => `${user.email} ${user.name ?? ""}`.toLowerCase().includes(search.toLowerCase())),
    [users, search],
  );

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">User management</h1>
          <p className="text-slate-400">Control owner access and review buyer activity.</p>
        </div>
        <Input className="max-w-sm" placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} />
      </Card>
      <Card className="overflow-x-auto p-0">
        <Table>
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Orders</Th>
              <Th>Inbox</Th>
              <Th>Joined</Th>
              <Th>Update</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-white/5">
                <Td>
                  <p className="font-medium text-white">{user.name ?? "Unnamed user"}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </Td>
                <Td>{user.role}</Td>
                <Td>{user._count.orders}</Td>
                <Td>{user._count.inboxMessages}</Td>
                <Td>{formatDate(user.createdAt)}</Td>
                <Td>
                  <form action="/api/admin/users" method="post" className="flex items-center gap-2">
                    <input type="hidden" name="_method" value="patch" />
                    <input type="hidden" name="userId" value={user.id} />
                    <Select name="role" defaultValue={user.role}>
                      <option value="USER">USER</option>
                      <option value="OWNER">OWNER</option>
                    </Select>
                    <Button variant="secondary">Save</Button>
                  </form>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
