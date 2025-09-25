import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', alias: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <Input placeholder="Alias" value={profile.alias} onChange={(e) => setProfile({ ...profile, alias: e.target.value })} />
          <Input placeholder="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          <Input placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          <div className="md:col-span-2 flex justify-end">
            <Button>Save</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input type="password" placeholder="Current password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
          <Input type="password" placeholder="New password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
          <Input type="password" placeholder="Confirm new password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
          <div className="md:col-span-3 flex justify-end">
            <Button>Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


