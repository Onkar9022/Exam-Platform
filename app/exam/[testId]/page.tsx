"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ExamLayout from "@/components/ExamLayout";
import QuestionPalette from "@/components/QuestionPalette";

interface Question {
  _id: string;
  question: string;
  options: string[];
}

interface TestData {
  _id: string;
  testId: string;
  title: string;
  duration: number;
  questions: Question[];
}

export default function ExamPage({ params }: { params: { testId: string } }) {
  const router = useRouter();
  const [test, setTest] = useState<TestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load test data
  useEffect(() => {
    fetch(`/api/tests/getTestById/${params.testId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.test) {
          setTest(data.test);
          
          // Try loading answers from local storage
          const savedAnswers = localStorage.getItem(`answers_${params.testId}`);
          if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
          }
        } else {
          router.push("/dashboard");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.testId, router]);

  // Prevent accidental refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Save answers to local storage on change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`answers_${params.testId}`, JSON.stringify(answers));
    }
  }, [answers, params.testId]);

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const clearResponse = () => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestionIndex];
      return newAnswers;
    });
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  const handleNext = () => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitExam = useCallback(async () => {
    if (!test || submitting) return;
    setSubmitting(true);
    
    // Format answers array for API
    const formattedAnswers = Object.entries(answers).map(([idx, option]) => ({
      questionIndex: parseInt(idx),
      selectedOption: option,
    }));

    try {
      const res = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test.testId,
          answers: formattedAnswers,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Clear local storage
        localStorage.removeItem(`answers_${test.testId}`);
        router.push(`/result/${test.testId}?resultId=${data.resultId}`);
      } else {
        alert("Failed to submit exam. Please try again or contact support.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting exam.");
      setSubmitting(false);
    }
  }, [test, submitting, answers, router]);

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Test Environment...</div>;
  if (!test) return null;

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <ExamLayout
      title={test.title}
      durationMinutes={test.duration}
      onTimeUp={submitExam}
      paletteNode={
        <QuestionPalette
          totalQuestions={test.questions.length}
          currentQuestion={currentQuestionIndex}
          answers={answers}
          markedForReview={markedForReview}
          onSelectQuestion={setCurrentQuestionIndex}
        />
      }
    >
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Question Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Question {currentQuestionIndex + 1}</h2>
            {markedForReview[currentQuestionIndex] && (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded border border-purple-200">
                Marked for Review
              </span>
            )}
          </div>
          
          <div className="prose max-w-none mb-8">
            <p className="text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">{currentQuestion.question}</p>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
              const letters = ["A", "B", "C", "D"];
              const isSelected = answers[currentQuestionIndex] === option;
              
              return (
                <label 
                  key={idx} 
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected ? "bg-blue-50 border-blue-500 shadow-sm" : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name={`question_${currentQuestionIndex}`}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={isSelected}
                      onChange={() => handleSelectOption(option)}
                    />
                  </div>
                  <div className="ml-3 flex-1 flex">
                    <span className="font-bold mr-2 text-gray-700">{letters[idx]}.</span>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center rounded-b-lg">
          <div className="flex space-x-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              onClick={clearResponse}
              disabled={!answers[currentQuestionIndex]}
              className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Clear Response
            </button>
            <button
              onClick={toggleMarkForReview}
              className="px-6 py-2 border border-purple-300 rounded font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
            >
              {markedForReview[currentQuestionIndex] ? "Unmark Review" : "Mark for Review"}
            </button>
          </div>

          <div className="flex space-x-3 items-center">
            {currentQuestionIndex < test.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-8 py-2 rounded font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
              >
                Save & Next
              </button>
            ) : (
              <button
                onClick={submitExam}
                disabled={submitting}
                className="px-8 py-2 rounded font-bold text-white bg-green-600 hover:bg-green-700 shadow-sm transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Test"}
              </button>
            )}
          </div>
        </div>
      </div>
    </ExamLayout>
  );
}
