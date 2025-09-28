const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Client = require('../models/Client');
const Task = require('../models/Task');
const Feedback = require('../models/Feedback');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cake';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  // Clean existing (optional)
  await Promise.all([
    User.deleteMany({}),
    Client.deleteMany({}),
    Task.deleteMany({}),
    Feedback.deleteMany({})
  ]);

  // Users
  const usersRaw = [
    { name: 'Alice Manager', email: 'alice@cake.dev', password: 'Passw0rd!', role: 'manager' },
    { name: 'Bob Leader', email: 'bob@cake.dev', password: 'Passw0rd!', role: 'leader' },
    { name: 'Carol Member', email: 'carol@cake.dev', password: 'Passw0rd!', role: 'member' },
    { name: 'Dan Member', email: 'dan@cake.dev', password: 'Passw0rd!', role: 'member' },
  ];
  const users = await User.create(usersRaw);

  const manager = users.find(u => u.role === 'manager');
  const leader = users.find(u => u.role === 'leader');
  const members = users.filter(u => u.role === 'member');

  // Clients
  const clients = await Client.insertMany([
    { name: 'Acme Corp', contact: { email: 'ops@acme.com', phone: '123-456-7890' }, tier: 'enterprise', createdBy: manager._id },
    { name: 'Globex', contact: { email: 'it@globex.com' }, tier: 'premium', createdBy: leader._id },
    { name: 'Umbrella', contact: { email: 'admin@umbrella.com' }, tier: 'basic', createdBy: manager._id },
  ]);

  // Tasks
  const taskData = [
    {
      title: 'Design dashboard layout',
      description: 'Create modern dashboard UI with charts and cards',
      clientId: clients[0]._id,
      assigneeIds: [members[0]._id],
      createdBy: manager._id,
      status: 'in-progress',
      priority: 'high',
      estimateHours: 16
    },
    {
      title: 'Implement auth flow',
      description: 'JWT login, register, refresh, role guards',
      clientId: clients[1]._id,
      assigneeIds: [leader._id],
      createdBy: manager._id,
      status: 'pending',
      priority: 'urgent',
      estimateHours: 12
    },
    {
      title: 'Write API docs',
      description: 'Swagger endpoints and examples',
      clientId: clients[2]._id,
      assigneeIds: [members[1]?._id].filter(Boolean),
      createdBy: leader._id,
      status: 'completed',
      priority: 'medium',
      estimateHours: 6,
      actualHours: 5
    }
  ];
  
  const tasks = [];
  for (const task of taskData) {
    const newTask = await Task.create(task);
    tasks.push(newTask);
  }

  // Feedback
  await Feedback.insertMany([
    { taskId: tasks[0]._id, clientId: clients[0]._id, score: 5, comment: 'Great progress!', createdBy: manager._id },
    { taskId: tasks[2]._id, clientId: clients[2]._id, score: 4, comment: 'Docs are clear.', createdBy: leader._id },
  ]);

  console.log('Seed complete:', {
    users: users.length,
    clients: clients.length,
    tasks: tasks.length
  });
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
