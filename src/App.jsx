import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const capabilities = [
  "Strategic Leadership & Vision",
  "Culture & Change Management",
  "Governance & Risk Management",
  "Talent & Skills",
  "Data Management & Infrastructure",
  "Model Development & Evaluation",
  "Technology Architecture & Integration",
  "Vendor & Ecosystem Collaboration",
  "Customer Interaction & Delivery",
  "Competitive Strategy & Business Context"
];

const levels = ["Ad-hoc", "Emerging", "Developing", "Integrated", "Optimized"];

const questions = capabilities.flatMap((cap, i) =>
  Array.from({ length: 3 }, (_, j) => ({
    id: `${i}-${j}`,
    text: `Q${i * 3 + j + 1}: Question for ${cap}`,
    capability: cap
  }))
);

export default function LLMCapabilityFramework() {
  const [responses, setResponses] = useState({});
  const [results, setResults] = useState(null);

  const handleChange = (qid, value) => {
    setResponses({ ...responses, [qid]: Number(value) });
  };

  const handleSubmit = () => {
    const grouped = {};
    questions.forEach(q => {
      if (!grouped[q.capability]) grouped[q.capability] = [];
      grouped[q.capability].push(responses[q.id]);
    });

    const resultData = Object.entries(grouped).map(([cap, scores]) => ({
      capability: cap,
      maturity: scores.reduce((a, b) => a + b, 0) / scores.length
    }));

    setResults(resultData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">LLM Capability Framework Assessment</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">About the Framework</h2>
        <p>
          This tool helps banks evaluate their readiness to deploy Large Language Models (LLMs)
          across 10 key capabilities. Based on the Capability Maturity Model Integration (CMMI),
          each capability is assessed using three diagnostic questions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Maturity Levels</h2>
        <ul className="list-disc list-inside">
          <li><strong>Ad-hoc</strong>: No formal processes, highly reactive.</li>
          <li><strong>Emerging</strong>: Initial efforts, informal practices.</li>
          <li><strong>Developing</strong>: Defined processes, inconsistent execution.</li>
          <li><strong>Integrated</strong>: Capabilities are coordinated and embedded.</li>
          <li><strong>Optimized</strong>: Continuous improvement and best practices in place.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Questionnaire</h2>
        <form className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="flex flex-col">
              <label className="font-medium">{q.text}</label>
              <select
                className="border rounded p-2 mt-1"
                value={responses[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                <option value="" disabled>Select maturity level</option>
                {levels.map((level, i) => (
                  <option key={level} value={i + 1}>{level}</option>
                ))}
              </select>
            </div>
          ))}
        </form>
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </section>

      {results && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Capability Maturity Results</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={results} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
              <YAxis dataKey="capability" type="category" width={200} />
              <Tooltip />
              <Bar dataKey="maturity" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
}
