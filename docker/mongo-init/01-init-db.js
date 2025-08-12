// MongoDB initialization script for Piece of Cake app
db = db.getSiblingDB('cake_db');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "role", "password"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        role: { enum: ["creator", "assigner", "member"] },
        password: { bsonType: "string" },
        status: { bsonType: "string" }
      }
    }
  }
});

db.createCollection('clients', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "contactEmail"],
      properties: {
        name: { bsonType: "string" },
        contactEmail: { bsonType: "string" },
        tier: { bsonType: "string" },
        notes: { bsonType: "string" }
      }
    }
  }
});

db.createCollection('tasks', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "createdBy"],
      properties: {
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        clientId: { bsonType: "objectId" },
        assigneeIds: { bsonType: "array" },
        createdBy: { bsonType: "objectId" },
        status: { enum: ["pending", "in-progress", "completed", "cancelled"] },
        priority: { enum: ["low", "medium", "high", "urgent"] },
        estimateHours: { bsonType: "number" },
        actualHours: { bsonType: "number" },
        revenue: { bsonType: "number" }
      }
    }
  }
});

db.createCollection('feedback', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["taskId", "clientId", "score"],
      properties: {
        taskId: { bsonType: "objectId" },
        clientId: { bsonType: "objectId" },
        score: { bsonType: "int", minimum: 1, maximum: 5 },
        comment: { bsonType: "string" }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.clients.createIndex({ "contactEmail": 1 });
db.tasks.createIndex({ "createdBy": 1 });
db.tasks.createIndex({ "assigneeIds": 1 });
db.tasks.createIndex({ "status": 1 });
db.feedback.createIndex({ "taskId": 1 });
db.feedback.createIndex({ "clientId": 1 });

print('Database initialization completed successfully!');
