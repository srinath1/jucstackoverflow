import React from "react";
import UserModel from "@/models/UserModel";
import QuestionModel from "@/models/QuestionModel";
import { connectDB } from "@/config/db";
import Image from "next/image";
import { dateTimeFormat } from "@/helpers/date-time-format";
import QuestionCard from "@/components/QuestionCard";
import { IQuestion } from "@/interfaces";
connectDB();
interface UserInfoProps {
  params: {
    userid: string;
  };
}

const UserInfo = async ({ params }: UserInfoProps) => {
  const userData: any = await UserModel.findById(params.userid);
  const questions: IQuestion[] = await QuestionModel.find({
    user: params.userid,
  });
  console.log("UserData", userData);
  return (
    <div>
      <div className="bg-gray-100 p-5 flex gap-5 items-center">
        <Image
          src={userData?.profilePicUrl!}
          alt="my image"
          height={70}
          width={70}
          className="rounded-full"
        />
        <div className="flex flex-col ">
          <h1 className="text-primary text-xl uppercase font-semibold">
            {userData?.name}
          </h1>
          <p className="text-gray-600 text-sm">{userData?.email}</p>
          <p className="text-gray-600 text-sm">
            {questions.length} Questions asked.
          </p>
        </div>
      </div>
      <div className="mt-5">
        Questions Asked By {userData?.name}-({questions?.length})
      </div>
      <div className="mt-5">
        <div className="flex flex-col gap-5">
          {questions.map((question) => (
            <QuestionCard
              key={question._id}
              question={JSON.parse(JSON.stringify(question))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
