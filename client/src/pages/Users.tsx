import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

type UserRow = { _id: string; username: string; email: string; role: 'manager' | 'leader' | 'member' };

export default function Users() {
  const [users] = useState<UserRow[]>([
    { _id: 'u1', username: 'manager', email: 'mgr@cake.dev', role: 'manager' },
    { _id: 'u2', username: 'lead', email: 'lead@cake.dev', role: 'leader' },
    { _id: 'u3', username: 'member', email: 'member@cake.dev', role: 'member' },
  ]);
  const [q, setQ] = useState('');
  const [role, setRole] = useState<string>('all');

  const filtered = useMemo(() => {
    return users.filter(u =>
      (role === 'all' || u.role === role) &&
      (u.username.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
    );
  }, [users, q, role]);

  return (
    <div className="p-6">
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Users</CardTitle>
          <div className="flex gap-3">
            <Input placeholder="Search users" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
            <Select value={role} onValueChange={(v) => setRole(v)}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="leader">Leader</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {filtered.map((u) => (
            <div key={u._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{u.username}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{u.email} • {u.role}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


