import { ReactNode } from "react";
import Timer from "./Timer";

interface ExamLayoutProps {
  title: string;
  candidateId?: string;
  name?: string;
  durationMinutes: number;
  onTimeUp: () => void;
  children: ReactNode;
  paletteNode: ReactNode;
}

export default function ExamLayout({
  title,
  durationMinutes,
  onTimeUp,
  children,
  paletteNode,
  candidateId = "Candidate",
  name = "Student",
}: ExamLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-md flex-shrink-0">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-xl font-bold truncate">{title}</h1>
          </div>
          <div className="flex-1 flex justify-center">
            <Timer durationMinutes={durationMinutes} onTimeUp={onTimeUp} />
          </div>
          <div className="flex-1 flex justify-end text-sm text-right pr-2">
            <div>
              <div className="font-semibold">{name}</div>
              <div className="text-blue-200 text-xs">ID: {candidateId}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left/Main Panel - Questions */}
        <div className="flex-1 p-4 overflow-y-auto">
          {children}
        </div>

        {/* Right Panel - Palette */}
        <div className="w-80 border-l border-gray-300 bg-gray-50 p-4 overflow-y-auto flex-shrink-0">
          {paletteNode}
        </div>
      </div>
    </div>
  );
}
