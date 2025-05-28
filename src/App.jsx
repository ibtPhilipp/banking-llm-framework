import { useState, useEffect, useRef } from "react";
import questionData from "./questions.json";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Info, Heart } from "lucide-react";

const levels = ["Ad-hoc", "Emerging", "Developing", "Integrated", "Optimized"];

const sections = [
  "Organizational Capabilities",
  "Contextual Capabilities",
  "Technical Capabilities"
];

const sectionColors = {
  "Organizational Capabilities": "#d946ef",
  "Contextual Capabilities": "#8b5cf6",
  "Technical Capabilities": "#3b82f6"
};

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const chartRef = useRef(null);
  const unansweredRef = useRef(null);
  const cardRef = useRef(null);
  const [forceValidate, setForceValidate] = useState(false);

  useEffect(() => {
    const flatQuestions = questionData.flatMap((entry, sectionIndex) =>
      entry.questions.map((text, qIndex) => ({
        id: `${sectionIndex}-${qIndex}`,
        text,
        capability: entry.capability,
        section: entry.section
      }))
    );
    setQuestions(flatQuestions);
  }, []);

  const handleChange = (qid, value) => {
    setResponses({ ...responses, [qid]: Number(value) });
  };

  const getUnanswered = () => {
    return questions
      .filter(q => q.section === sections[currentStep])
      .filter(q => !responses[q.id]);
  };

  const scrollToFirstUnanswered = () => {
    setTimeout(() => {
      unansweredRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const scrollToCardTop = () => {
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSubmit = () => {
    const unanswered = getUnanswered();
    if (unanswered.length > 0) {
      setForceValidate(true);
      scrollToFirstUnanswered();
      return;
    }
    const grouped = {};
    questions.forEach(q => {
      if (!grouped[q.capability]) grouped[q.capability] = [];
      grouped[q.capability].push(responses[q.id]);
    });

    const resultData = Object.entries(grouped).map(([cap, scores]) => {
      const section = questions.find(q => q.capability === cap)?.section || "";
      return {
        capability: cap,
        maturity: scores.reduce((a, b) => a + b, 0) / scores.length,
        section
      };
    });

    setResults(resultData);
    setTimeout(() => {
      chartRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const nextStep = () => {
    const unanswered = getUnanswered();
    if (unanswered.length > 0) {
      setForceValidate(true);
      scrollToFirstUnanswered();
      return;
    }
    setForceValidate(false);
    setCurrentStep((prev) => Math.min(prev + 1, sections.length - 1));
    scrollToCardTop();
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    scrollToCardTop();
  };

  const getFooterMessage = () => {
    if (!results || results.length === 0) return null;
    const sorted = [...results].sort((a, b) => a.maturity - b.maturity);
    const lowest = sorted[0];
    if (lowest.maturity === 5) return "🎉 Congratulations! Your bank is implementing LLMs perfectly.";
    return `Your bank should focus on building the capability ${lowest.capability}!`;
  };

  const tickFormatter = (value) => {
    const index = [1, 2, 3, 4, 5].indexOf(value);
    return levels[index] || value;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const rounded = Math.round(payload[0].value);
      const maturityLabel = tickFormatter(rounded);
      return (
        <div className="bg-white p-2 border rounded text-sm shadow font-medium">
          <strong>{payload[0].payload.capability}</strong>
          <div>Maturity Level: {maturityLabel}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="max-w-screen-lg mx-auto px-4 py-16 space-y-16">
      <header className="min-h-screen flex flex-col justify-center items-center text-center py-12">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">Banking LLM Capability Readiness Framework</h1>
          <p className="text-lg max-w-2xl mx-auto mt-6">
            A structured self-assessment tool for evaluating your bank's readiness to deploy Large Language Models (LLMs)
            across strategic, contextual, and technical capabilities.
          </p>
        </div>
        <div className="mt-20">
          <Button onClick={() => document.getElementById("questionnaire")?.scrollIntoView({ behavior: "smooth" })}>
            Start Assessment
          </Button>
        </div>
      </header>

      <Separator className="w-full max-w-md mx-auto" id="questionnaire" />

      <section className="space-y-2">
        <p className="text-base">
          This site introduces the Banking LLM Capability Readiness Framework. It aims to provide a structured understanding
          of the organizational, contextual, and technical capabilities required to effectively implement LLMs in the banking sector.
          To account for variation in capability readiness, the framework also incorporates five maturity levels: Ad-hoc, emerging,
          developing, integrated, and optimized. The framework thereby serves not only as an analytical tool for assessing a bank's
          current LLM readiness, but also as a strategic orientation tool that supports building targeted capabilities over time.
        </p>
        <p className="text-base">
          For further insights see the corresponding academic paper: <a href="#" className="underline">here</a>.
        </p>

        <Accordion type="single" className="mt-8" collapsible>
          <AccordionItem value="maturity">
            <AccordionTrigger className="rounded-md border px-4 py-2 font-medium text-left hover:bg-muted bg-background shadow-sm">
              Maturity Levels Definitions
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2 border rounded-md">
              <ul className="list-disc list-inside space-y-1 font-medium">
                <li><strong>Ad-hoc</strong>: No formal processes, highly reactive.</li>
                <li><strong>Emerging</strong>: Initial efforts, informal practices.</li>
                <li><strong>Developing</strong>: Defined processes, inconsistent execution.</li>
                <li><strong>Integrated</strong>: Capabilities are coordinated and embedded.</li>
                <li><strong>Optimized</strong>: Continuous improvement and best practices in place.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Card ref={cardRef}>
        <CardHeader>
          <CardTitle className="text-2xl">LLM Readiness Assessment</CardTitle>
          <CardDescription>Answer 33 questions and see your LLM readiness.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          <section className="flex justify-between items-center py-6">
            {sections.map((label, index) => (
              <div key={label} className="flex-1 text-center relative">
                {index !== 0 && <div className="absolute top-2 left-0 w-1/2 h-0.5 bg-gray-200 z-0" />}
                {index !== sections.length - 1 && <div className="absolute top-2 right-0 w-1/2 h-0.5 bg-gray-200 z-0" />}
                <div className={`w-4 h-4 rounded-full mx-auto relative z-10 ${currentStep === index ? "bg-blue-600" : "bg-gray-300"}`} />
                <span className={`block mt-1 text-sm ${currentStep === index ? "font-semibold" : "text-gray-500"}`}>{label}</span>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            {questions.filter(q => q.section === sections[currentStep]).map((q, i) => {
              const isUnanswered = !responses[q.id];
              const ref = forceValidate && isUnanswered && i === 0 ? unansweredRef : null;
              return (
                <div key={q.id} ref={ref} className={`rounded-lg p-4 ${forceValidate && isUnanswered ? "bg-red-50 border border-red-300" : "bg-white"}`}>
                  <p className={`font-medium text-base leading-snug ${forceValidate && isUnanswered ? "text-red-700" : "text-gray-900"}`}>{q.text}</p>
                  <RadioGroup value={responses[q.id]?.toString() || ""} onValueChange={(val) => handleChange(q.id, Number(val))} className="flex flex-wrap gap-4 mt-2">
                    {levels.map((level, i) => (
                      <label key={level} htmlFor={`${q.id}-${i}`} className="flex items-center space-x-2 border border-gray-200 px-3 py-1 rounded-md hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value={(i + 1).toString()} id={`${q.id}-${i}`} />
                        <span className="text-sm text-gray-800">{level}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              );
            })}
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={prevStep} disabled={currentStep === 0}>Back</Button>
              {currentStep < sections.length - 1 ? (
                <Button onClick={nextStep}>Next</Button>
              ) : (
                <Button onClick={handleSubmit}>Submit</Button>
              )}
            </div>
          </section>
        </CardContent>
      </Card>

   {results && (
        <section ref={chartRef}>
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-medium">Banking LLM Readiness</CardTitle>
              <CardDescription className="font-medium">
                Your LLM readiness across all organizational, contextual, and technical capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={results.map(entry => ({
                    ...entry,
                    fill: sectionColors[entry.section] || "#8884d8"
                  }))}
                  layout="vertical"
                  barSize={42}
                  margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={tickFormatter}
                    tick={{ fontSize: 14, fontWeight: 500 }}
                  />
                  <YAxis
                    dataKey="capability"
                    type="category"
                    width={200}
                    tick={{ fontSize: 14, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    payload={Object.entries(sectionColors).map(([section, color]) => ({
                      value: section,
                      type: "square",
                      color
                    }))}
                    formatter={(value) => <span className="text-lg">{value}</span>}
                  />
                  <Bar dataKey="maturity" radius={5} fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span>{getFooterMessage()}</span>
              </div>
            </CardFooter>
          </Card>
        </section>
      )}

      <Separator className="w-full max-w-md mx-auto mb-8" />
      <footer className="text-center text-sm text-muted-foreground mt-0">
        Created with <Heart className="inline-block w-4 h-4 text-red-500 mx-1" />
      </footer>
    </main>
  );
}
