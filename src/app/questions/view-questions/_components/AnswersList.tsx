import { connectDB } from "@/config/db";
import { IQuestion } from "@/interfaces";
import AnswerModel from "@/models/AnswerModel";
import React from "react";
import Answercard from "./Answercard";
import { currentUser } from "@clerk/nextjs";
import { getMongoDbUserIdFromClerkUserId } from "@/actions/users";

connectDB();

const AnswersList = async ({ question }: { question: IQuestion }) => {
  const answers = await AnswerModel.find({ question: question._id })
    .populate("user")
    .populate("question")
    .sort({ updatedAt: -1 });
  const currentUserData = await currentUser();
  const mongoUserId = await getMongoDbUserIdFromClerkUserId(
    currentUserData?.id!
  );
  return (
    <div className="flex flex-col gap-3 mt-3">
      {answers.map((answer: any) => (
        <Answercard
          answer={JSON.parse(JSON.stringify(answer))}
          key={answer._id}
          mongoUserId={JSON.parse(JSON.stringify(mongoUserId))}
        />
      ))}
    </div>
  );
};

export default AnswersList;
