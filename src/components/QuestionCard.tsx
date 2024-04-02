"use client";
import { IQuestion } from "@/interfaces";
import React from "react";
import { dateTimeFormat } from "@/helpers/date-time-format";
import { useRouter } from "next/navigation";

const QuestionCard = ({ question }: { question: IQuestion }) => {
  const router = useRouter();
  return (
    <div
      className="flex flex-col gap-3 border bg-gray-50 hover:bg-gray-200 mt-5 p-3 cursor-pointer"
      onClick={() => router.push(`/questions/view-questions/${question._id}`)}
    >
      <h1>{question.title}</h1>
      <p className="text-gray-line-clamp-3 text-sm">{question.description}</p>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <span className="text-primary text-sm text-secondary">
            {question.totalAnswers > 0 ? question.totalAnswers : "No"} answers
          </span>
        </div>
        <div className="flex gap-10 text-xs flex-wrap">
          <span>
            Asked On{" "}
            <span className="text-secondary">
              {dateTimeFormat(question.updatedAt)}
            </span>
          </span>
          <span>
            Asked By{" "}
            <span className="text-secondary">{question.user.name}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
