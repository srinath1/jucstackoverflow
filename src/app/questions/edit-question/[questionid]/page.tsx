import React from "react";
import QuestionForm from "../../_components/page";
import QuestionModel from "@/models/QuestionModel";
import { IQuestion } from "@/interfaces";
import { connectDB } from "@/config/db";
connectDB();
interface EditQuestionProps {
  params: {
    questionid: string;
  };
}

const EditQuestion = async ({ params }: EditQuestionProps) => {
  const question = (await QuestionModel.findById(params.questionid).populate(
    "user"
  )) as IQuestion;
  return (
    <div>
      <div className="bg-gray-100 p-3">
        <h1 className="text-secondary font-semibold text-xl">Edit Question</h1>
        <span className="text-gray-600 text-sm">
          Write a question to ask from the network
        </span>
      </div>
      <div className="border p-3 mt-5">
        <QuestionForm
          initialData={JSON.parse(JSON.stringify(question))}
          type="edit"
        />
      </div>
    </div>
  );
};

export default EditQuestion;
