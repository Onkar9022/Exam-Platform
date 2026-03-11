import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Test from "@/models/Test";

export async function GET(
  request: Request,
  { params }: { params: { testId: string } }
) {
  try {
    await dbConnect();
    const test = await Test.findOne({ testId: params.testId });

    if (!test) {
      return NextResponse.json({ message: "Test not found" }, { status: 404 });
    }

    // Strip out the correctAnswer field so client doesn't see it
    const sanitizedQuestions = test.questions.map((q: { _id: string, question: string, options: string[] }) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    const sanitizedTest = {
      _id: test._id,
      testId: test.testId,
      title: test.title,
      duration: test.duration,
      questions: sanitizedQuestions,
    };

    return NextResponse.json({ test: sanitizedTest }, { status: 200 });
  } catch (error) {
    console.error("Fetch API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
