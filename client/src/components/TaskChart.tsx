import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const weeklyData = [
  { day: 'Mon', completed: 8, inProgress: 3, todo: 2 },
  { day: 'Tue', completed: 6, inProgress: 4, todo: 3 },
  { day: 'Wed', completed: 10, inProgress: 2, todo: 1 },
  { day: 'Thu', completed: 7, inProgress: 5, todo: 2 },
  { day: 'Fri', completed: 9, inProgress: 3, todo: 4 },
  { day: 'Sat', completed: 4, inProgress: 2, todo: 1 },
  { day: 'Sun', completed: 3, inProgress: 1, todo: 2 },
];

const taskStatusData = [
  { name: 'Completed', value: 45, color: '#10b981' },
  { name: 'In Progress', value: 30, color: '#f59e0b' },
  { name: 'Todo', value: 25, color: '#6b7280' },
];

export function TaskChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Task Completion Chart */}
      <div>
        <h3 className="font-medium mb-4 text-slate-900 dark:text-slate-100">Weekly Task Completion</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
            <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
            <Bar dataKey="todo" stackId="a" fill="#6b7280" name="Todo" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Task Status Distribution */}
      <div>
        <h3 className="font-medium mb-4 text-slate-900 dark:text-slate-100">Task Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={taskStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {taskStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4">
          {taskStatusData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}