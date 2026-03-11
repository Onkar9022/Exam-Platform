import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Test from "@/models/Test";

// Temporary seed route: /api/tests/seed
export async function GET() {
  try {
    await dbConnect();

    // Check if tests already exist
    const count = await Test.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: "Mock tests already seeded." }, { status: 200 });
    }

    const mockTests = [];
    for (let i = 1; i <= 4; i++) {
      const questions = [];
      for (let j = 1; j <= 30; j++) {
        questions.push({
          question: `Sample GATE Question ${j} for Mock Test ${i}:\nWhat is time complexity of binary search?`,
          options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
          correctAnswer: "O(log n)",
        });
      }

      mockTests.push({
        testId: `MOCKTEST0${i}`,
        title: `GATE Mock Test ${i} - General Aptitude & Core Subjects`,
        duration: 90, // 90 minutes
        questions,
      });
    }

    await Test.insertMany(mockTests);

    return NextResponse.json({ message: "Successfully seeded 4 mock tests" }, { status: 201 });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
