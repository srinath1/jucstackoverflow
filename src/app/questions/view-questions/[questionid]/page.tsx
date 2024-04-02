import React from "react";
import QuestionModel from "@/models/QuestionModel";
import { IQuestion } from "@/interfaces";
import { dateTimeFormat } from "@/helpers/date-time-format";
import ViewCode from "@/components/ViewCode";
import QuestionFooterInfo from "../_components/QuestionFooterInfo";
import { currentUser } from "@clerk/nextjs";
import { getMongoDbUserIdFromClerkUserId } from "@/actions/users";
import { connectDB } from "@/config/db";
import AnswersList from "../_components/AnswersList";
import Link from "next/link";
connectDB();

interface ViewQuestionProps {
  params: {
    questionid: string;
  };
}

const ViewQuestion = async ({ params }: ViewQuestionProps) => {
  const question = (await QuestionModel.findById(params.questionid).populate(
    "user"
  )) as IQuestion;
  const currentUserData = await currentUser();
  const mongoUserId = await getMongoDbUserIdFromClerkUserId(
    currentUserData?.id!
  );
  return (
    <div>
      {" "}
      <div className="bg-gray-100 p-3">
        <h1 className="text-primary  text-lg md:text-xl">{question.title}</h1>
        <div className="flex gap-5 md:gap-10 text-xs mt-2">
          <span>
            Asked On{" "}
            <span className="text-secondary">
              {dateTimeFormat(question.createdAt)}
            </span>
          </span>
          <Link href={`/users/${question.user._id}`}>
            Asked By{" "}
            <span className="text-secondary underline cursor-pointer">
              {question.user.name}
            </span>
          </Link>
        </div>
      </div>
      <div className="flex gap-5 mt-5">
        {question.tags.map((tag: string, index: number) => (
          <Link
            href={`/?tag=${tag}`}
            key={index}
            className="bg-primary/20 p-2 rounded-md text-sm text-gray-600 capitalize underline cursor-pointer"
          >
            {tag}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-5 mt-3">
        <p className="text-sm text-gray-600">{question.description}</p>
        <ViewCode code={question.code} />
        <QuestionFooterInfo
          question={JSON.parse(JSON.stringify(question))}
          mongodbuserId={mongoUserId.toString()}
        />
      </div>
      {question.totalAnswers > 0 && (
        <AnswersList question={JSON.parse(JSON.stringify(question))} />
      )}
    </div>
  );
};

export default ViewQuestion;
