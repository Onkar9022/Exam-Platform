"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CheckCircle, XCircle, MinusCircle } from "lucide-react";

interface AnalysisItem {
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string | null;
  status: "Correct" | "Incorrect" | "Unattempted";
}

interface ResultData {
  summary: {
    score: number;
    totalQuestions: number;
    correct: number;
    wrong: number;
    unattempted: number;
    percentage: number;
    submittedAt: string;
  };
  analysis: AnalysisItem[];
  testTitle: string;
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("resultId");
  const router = useRouter();
  
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resultId) {
      router.push("/dashboard");
      return;
    }

    fetch(`/api/exam/result/${resultId}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.summary) {
          setData(resData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [resultId, router]);

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Results...</div>;
  if (!data) return <div className="text-center mt-20 text-xl text-red-600">Failed to load results.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-800 px-6 py-4 text-white">
            <h1 className="text-2xl font-bold">Score Card: {data.testTitle}</h1>
            <p className="text-blue-200 text-sm mt-1">
              Submitted on {new Date(data.summary.submittedAt).toLocaleString()}
            </p>
          </div>
          
          <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-x divide-gray-100">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium">Your Score</span>
              <span className="text-4xl font-black text-blue-700 mt-2">{data.summary.score} <span className="text-xl text-gray-400 font-medium">/ {data.summary.totalQuestions}</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium">Percentage</span>
              <span className="text-3xl font-bold text-gray-800 mt-2">{data.summary.percentage.toFixed(2)}%</span>
            </div>
            <div className="flex flex-col text-green-600">
              <span className="text-sm font-medium uppercase tracking-wider">Correct</span>
              <span className="text-3xl font-bold mt-2">{data.summary.correct}</span>
            </div>
            <div className="flex flex-col text-red-600">
              <span className="text-sm font-medium uppercase tracking-wider">Incorrect</span>
              <span className="text-3xl font-bold mt-2">{data.summary.wrong}</span>
            </div>
            <div className="flex flex-col text-gray-500">
              <span className="text-sm font-medium uppercase tracking-wider">Unattempted</span>
              <span className="text-3xl font-bold mt-2">{data.summary.unattempted}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start space-x-4">
          <Link href="/dashboard" className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition">
            Back to Dashboard
          </Link>
        </div>

        {/* Detailed Analysis */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Question-wise Analysis</h2>
          <div className="space-y-6">
            {data.analysis.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Question Header status bar */}
                <div className={`px-4 py-2 border-b flex items-center justify-between ${
                  item.status === 'Correct' ? 'bg-green-50 border-green-100' :
                  item.status === 'Incorrect' ? 'bg-red-50 border-red-100' :
                  'bg-gray-50 border-gray-100'
                }`}>
                  <div className="font-bold flex items-center space-x-2">
                    <span className="text-gray-600">Question {item.questionNumber}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-medium text-sm">
                    {item.status === 'Correct' && <><CheckCircle className="w-4 h-4 text-green-600"/> <span className="text-green-700">Correct (+1)</span></>}
                    {item.status === 'Incorrect' && <><XCircle className="w-4 h-4 text-red-600"/> <span className="text-red-700">Incorrect (0)</span></>}
                    {item.status === 'Unattempted' && <><MinusCircle className="w-4 h-4 text-gray-500"/> <span className="text-gray-600">Unattempted</span></>}
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-lg text-gray-800 mb-6 whitespace-pre-wrap">{item.question}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {item.options.map((option, optIdx) => {
                      const letters = ["A", "B", "C", "D"];
                      let className = "p-4 rounded border flex items-start space-x-3 ";
                      
                      // Determination logic for colors
                      if (option === item.correctAnswer) {
                        className += "bg-green-50 border-green-500 text-green-900 font-medium shadow-sm ring-1 ring-green-500";
                      } else if (option === item.userAnswer && item.status === 'Incorrect') {
                        className += "bg-red-50 border-red-300 text-red-900 shadow-sm";
                      } else {
                        className += "bg-gray-50 border-gray-200 text-gray-700";
                      }

                      return (
                        <div key={optIdx} className={className}>
                          <span className="font-bold shrink-0">{letters[optIdx]}.</span>
                          <span>{option}</span>
                          
                          {/* Badge indicators */}
                          <div className="ml-auto text-xs font-bold pt-1 uppercase tracking-wider shrink-0 flex flex-col items-end gap-1">
                            {option === item.correctAnswer && <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded">Correct Answer</span>}
                            {option === item.userAnswer && option !== item.correctAnswer && <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded">Your Answer</span>}
                            {option === item.userAnswer && option === item.correctAnswer && <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded">Your Answer</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
