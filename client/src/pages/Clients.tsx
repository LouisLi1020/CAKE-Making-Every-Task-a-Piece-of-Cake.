import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

type ClientRow = { _id: string; name: string; email: string; tier: 'basic' | 'premium' | 'enterprise' };

export default function Clients() {
  const [clients, setClients] = useState<ClientRow[]>([
    { _id: '1', name: 'Acme Corp', email: 'ops@acme.com', tier: 'enterprise' },
    { _id: '2', name: 'Globex', email: 'it@globex.com', tier: 'premium' },
  ]);
  const [q, setQ] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ClientRow>({ _id: '', name: '', email: '', tier: 'basic' });

  const filtered = useMemo(
    () => clients.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase())),
    [clients, q]
  );

  const openCreate = () => { setForm({ _id: '', name: '', email: '', tier: 'basic' }); setIsOpen(true); };
  const create = () => { setClients([{ ...form, _id: crypto.randomUUID() }, ...clients]); setIsOpen(false); };

  return (
    <div className="p-6">
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Clients</CardTitle>
          <div className="flex gap-3">
            <Input placeholder="Search clients" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openCreate}>New Client</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Client</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v as ClientRow['tier'] })}>
                    <SelectTrigger><SelectValue placeholder="Tier" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={create}>Create</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {filtered.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.email} • {c.tier}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


