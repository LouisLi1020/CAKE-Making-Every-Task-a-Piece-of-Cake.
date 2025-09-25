import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

type Row = { _id: string; title: string; type: 'bug' | 'feature' | 'improvement' | 'other'; priority: 'low' | 'medium' | 'high'; status: 'open' | 'in-progress' | 'resolved' | 'closed' };

export default function Feedback() {
  const [items, setItems] = useState<Row[]>([
    { _id: 'f1', title: 'Export CSV', type: 'feature', priority: 'medium', status: 'open' },
  ]);
  const [q, setQ] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Row>({ _id: '', title: '', type: 'feature', priority: 'medium', status: 'open' });

  const filtered = useMemo(() => items.filter(i => i.title.toLowerCase().includes(q.toLowerCase())), [items, q]);
  const create = () => { setItems([{ ...form, _id: crypto.randomUUID() }, ...items]); setIsOpen(false); };

  return (
    <div className="p-6">
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Feedback</CardTitle>
          <div className="flex gap-3">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">New Feedback</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Feedback</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Row['type'] })}>
                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Row['priority'] })}>
                    <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
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
          {filtered.map((f) => (
            <div key={f._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{f.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{f.type} • {f.priority} • {f.status}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


