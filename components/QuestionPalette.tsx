"use client";

interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: { [key: number]: string };
  markedForReview: { [key: number]: boolean };
  onSelectQuestion: (index: number) => void;
}

export default function QuestionPalette({
  totalQuestions,
  currentQuestion,
  answers,
  markedForReview,
  onSelectQuestion,
}: QuestionPaletteProps) {
  const getStatusColor = (index: number) => {
    if (markedForReview[index]) return "bg-purple-600 text-white";
    if (answers[index]) return "bg-green-600 text-white";
    if (currentQuestion === index) return "bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-500";
    return "bg-gray-200 text-gray-800 hover:bg-gray-300";
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full overflow-y-auto">
      <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Question Palette</h3>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <button
            key={i}
            onClick={() => onSelectQuestion(i)}
            className={`w-10 h-10 rounded-md flex items-center justify-center font-medium transition-colors ${getStatusColor(i)}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded bg-green-600 inline-block"></span>
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded bg-purple-600 inline-block"></span>
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded bg-gray-200 inline-block"></span>
          <span>Not Visited / Unanswered</span>
        </div>
      </div>
    </div>
  );
}
