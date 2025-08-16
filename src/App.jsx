import { useEffect, useState } from "react";
import { api } from "./lib/api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => { api("/api/health").then(console.log); }, []);
  useEffect(() => { api("/api/todos").then(setTodos); }, []);

  async function addTodo(e) {
    e.preventDefault();
    const todo = await api("/api/todos", { method: "POST", body: JSON.stringify({ text }) });
    setTodos([todo, ...todos]);
    setText("");
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
      <h1>MERN Todos</h1>
      <form onSubmit={addTodo}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="New todo..." />
        <button>Add</button>
      </form>
      <ul>
        {todos.map(t => <li key={t._id}>{t.text}</li>)}
      </ul>
    </main>
  );
}
