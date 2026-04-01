import { useState } from "react";
import "./App.css";

export default function App() {
  const [tone, setTone] = useState("Formal");
  const [purpose, setPurpose] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purpose.trim()) return alert("Please enter the purpose.");

    setLoading(true);
    setResult("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone, purpose }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.result);
      } else {
        alert(data.error || "Something went wrong!");
      }
    } catch (err) {
      alert("Failed to fetch from server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Email Genie</h1>

      <form className="email-form" onSubmit={handleSubmit}>
        <label>
          Tone
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option>Formal</option>
            <option>Friendly</option>
            <option>Persuasive</option>
            <option>Casual</option>
            <option>Empathetic</option>
          </select>
        </label>

        <label>
          Purpose
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Describe the purpose of your email..."
            rows={5}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Email"}
        </button>
      </form>

      {result && (
        <section className="result">
          <h2>Generated Email</h2>
          <pre>{result}</pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(result);
              alert("Copied to clipboard!");
            }}
          >
            Copy Email
          </button>
        </section>
      )}
    </div>
  );
}