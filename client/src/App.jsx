import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div className="container">
        <h1>🍰 Piece of Cake</h1>
        <p className="subtitle">Task Management Made Simple</p>
        
        <div className="card">
          <h2>Welcome to M1 - Scaffolding! 🚀</h2>
          <p>
            This is the React frontend running on <code>localhost:5173</code>
          </p>
          <p>
            Backend health check: <a href="http://localhost:3000/healthz" target="_blank" rel="noopener noreferrer">http://localhost:3000/healthz</a>
          </p>
          
          <div className="status">
            <div className="status-item">
              <span className="status-label">Frontend:</span>
              <span className="status-value success">✅ Running</span>
            </div>
            <div className="status-item">
              <span className="status-label">Backend:</span>
              <span className="status-value pending">⏳ Start with `npm run dev` in server/</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Next Steps</h3>
          <ul>
            <li>✅ M0 - Environment & Repo (Completed)</li>
            <li>🔄 M1 - Scaffolding (In Progress)</li>
            <li>⏳ M2 - Auth & Users</li>
            <li>⏳ M3 - Clients (mini-CRM)</li>
            <li>⏳ M4 - Tasks CRUD + RBAC</li>
          </ul>
        </div>

        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
