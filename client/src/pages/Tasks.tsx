import React, { useEffect, useState } from 'react';
import { tasksAPI } from '../services/api';
import { Task } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: '', priority: 'medium', status: 'todo' });

  const load = async () => {
    const data = await tasksAPI.getAll();
    const list = Array.isArray(data) ? data : (data?.tasks || data?.data || []);
    setTasks(list as unknown as Task[]);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    await tasksAPI.create(form);
    setIsOpen(false);
    setForm({ title: '', priority: 'medium', status: 'todo' });
    await load();
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Tasks</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">New Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button onClick={create}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {(Array.isArray(tasks) ? tasks : []).map((t) => (
            <div key={t._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.status} • {t.priority}</p>
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


