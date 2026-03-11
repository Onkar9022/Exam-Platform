import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Test from "@/models/Test";

export async function GET() {
  try {
    await dbConnect();
    // Fetch tests but omit the 'questions' array for the dashboard list
    const tests = await Test.find({}, { title: 1, duration: 1, testId: 1, 'questions.length': 1 });
    
    // Calculate total questions elegantly
    const formattedTests = tests.map((t) => ({
      _id: t._id,
      testId: t.testId,
      title: t.title,
      duration: t.duration,
      totalQuestions: t.questions?.length || 0,
    }));

    return NextResponse.json({ tests: formattedTests }, { status: 200 });
  } catch (error) {
    console.error("getTests error:", error);
    return NextResponse.json({ message: "Failed to fetch tests" }, { status: 500 });
  }
}
