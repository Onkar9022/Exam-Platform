import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Result from "@/models/Result";
import Test from "@/models/Test";

export async function GET(
  request: Request,
  { params }: { params: { resultId: string } }
) {
  try {
    await dbConnect();
    
    const result = await Result.findById(params.resultId).lean();
    if (!result) {
      return NextResponse.json({ message: "Result not found" }, { status: 404 });
    }

    const test = await Test.findOne({ testId: result.testId }).lean();
    if (!test) {
      return NextResponse.json({ message: "Test not found" }, { status: 404 });
    }

    const totalQuestions = test.questions.length;
    let correct = 0;
    let wrong = 0;
    const unattempted = totalQuestions - result.answers.length;

    // Build question-wise analysis
    const analysis = test.questions.map((q: { question: string, options: string[], correctAnswer: string }, index: number) => {
      const userAnswer = result.answers.find((a: { questionIndex: number, selectedOption: string }) => a.questionIndex === index);
      const isCorrect = userAnswer ? userAnswer.selectedOption === q.correctAnswer : false;
      const isAttempted = !!userAnswer;

      if (isAttempted) {
        if (isCorrect) correct++;
        else wrong++;
      }

      return {
        questionNumber: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: userAnswer ? userAnswer.selectedOption : null,
        status: isAttempted ? (isCorrect ? "Correct" : "Incorrect") : "Unattempted",
      };
    });

    return NextResponse.json({
      summary: {
        score: result.score,
        totalQuestions,
        correct,
        wrong,
        unattempted,
        percentage: result.percentage,
        submittedAt: result.submittedAt,
      },
      analysis,
      testTitle: test.title,
    }, { status: 200 });

  } catch (error) {
    console.error("Result fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
