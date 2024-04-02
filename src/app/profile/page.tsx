import React from "react";
import ProfileTabs from "./_components/ProfileTabs";
import { currentUser } from "@clerk/nextjs";
import QuestionModel from "@/models/QuestionModel";
import { getMongoDbUserIdFromClerkUserId } from "@/actions/users";
import { IQuestion } from "@/interfaces/index";
import AnswerModel from "@/models/AnswerModel";
import CommentModel from "@/models/CommentModel";
interface ProfilePageProps {
  searchParams: any;
}

const ProfilePage = async ({ searchParams }: { searchParams: any }) => {
  const currentUserData = await currentUser();
  const mongoUserId = await getMongoDbUserIdFromClerkUserId(
    currentUserData?.id!
  );
  console.log("SP", searchParams.tab);
  let askedQuestions: IQuestion[] = [];
  let answeredQuestions: IQuestion[] = [];
  let savedQuestions: IQuestion[] = [];
  let commentedQuestions = [];
  const tab = searchParams.tab || "asked";
  if (tab === "asked") {
    askedQuestions = await QuestionModel.find({
      user: mongoUserId,
    })
      .sort({ created: -1 })
      .populate("user");
  }
  if (tab === "answered") {
    answeredQuestions = await AnswerModel.find({ user: mongoUserId })
      .sort({ updatedAt: -1 })
      .populate("question");
  }
  if (tab === "commented") {
    commentedQuestions = (await CommentModel.find({ user: mongoUserId })
      .sort({ updatedAt: -1 })
      .populate("question")) as any;
  }
  if (tab === "saved") {
    savedQuestions = await QuestionModel.find({
      savedBy: {
        $in: [mongoUserId],
      },
    });
  }

  console.log("Answered Questions", answeredQuestions);
  return (
    <div>
      <ProfileTabs
        askedQuestions={JSON.parse(JSON.stringify(askedQuestions))}
        answeredQuestions={JSON.parse(
          JSON.stringify(
            answeredQuestions.map((answer: any) => answer.question)
          )
        )}
        savedQuestions={JSON.parse(JSON.stringify(savedQuestions))}
        mongoUserId={JSON.parse(JSON.stringify(mongoUserId))}
        commentedQuestions={JSON.parse(
          JSON.stringify(
            commentedQuestions.map((comment: any) => comment.question)
          )
        )}
      />
    </div>
  );
};

export default ProfilePage;
