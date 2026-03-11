import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

const TestSchema = new mongoose.Schema(
  {
    testId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Test || mongoose.model("Test", TestSchema);
