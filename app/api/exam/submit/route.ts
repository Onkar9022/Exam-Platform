import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Test from "@/models/Test";
import Result from "@/models/Result";
import { extractUserFromRequest } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userPayload = extractUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { testId, answers } = await request.json(); // answers is [{ questionIndex: 0, selectedOption: 'A' }, ...]

    if (!testId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    const test = await Test.findOne({ testId });
    if (!test) {
      return NextResponse.json({ message: "Test not found" }, { status: 404 });
    }

    let score = 0;
    const totalQuestions = test.questions.length;

    // Calculate score
    for (const ans of answers) {
      if (ans.questionIndex >= 0 && ans.questionIndex < totalQuestions) {
        const question = test.questions[ans.questionIndex];
        if (question.correctAnswer === ans.selectedOption) {
          score += 1;
        }
      }
    }

    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    const result = await Result.create({
      userId: (userPayload as { userId: string }).userId,
      testId,
      answers,
      score,
      percentage,
      submittedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Exam submitted successfully", resultId: result._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
