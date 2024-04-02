"use client";

import React from "react";
import { Tabs, Tab, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { IQuestion } from "@/interfaces/index";
import axios from "axios";
import toast from "react-hot-toast";

interface ProfileTabsProps {
  askedQuestions: IQuestion[];
  answeredQuestions: IQuestion[];
  savedQuestions: IQuestion[];
  mongoUserId: string;
  commentedQuestions: IQuestion[];
}

const ProfileTabs = ({
  askedQuestions,
  answeredQuestions,
  savedQuestions,
  mongoUserId,
  commentedQuestions,
}: ProfileTabsProps) => {
  const router = useRouter();
  const [savedLoading, setSavedLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedQuestionToDelete, setSelectedQuestionToDelete] =
    React.useState<string | null>(null);
  const deleteQuestion = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/questions/${id}`);
      router.refresh();
      toast.success("Question deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const getEmptyMessage = (): any => {
    return (
      <div>
        <h1 className="text-sm">No Questions Found</h1>
      </div>
    );
  };

  console.log("Commented Question", commentedQuestions);

  const getQuestion = (question: IQuestion) => {
    return (
      <div className="border p-3 flex flex-col gap-2 bg-gray-50 hover:border-gray-500 cursor-pointer">
        <h1>{question.title}</h1>
        <span className="text-gray-500 text-sm line-clamp-2">
          {question.description}
        </span>
        <div className="flex justify-end gap-5 mt-5">
          <Button
            size="sm"
            variant="flat"
            onClick={() => {
              router.push(`/questions/view-questions/${question._id}`);
            }}
          >
            View
          </Button>

          {question.user._id === mongoUserId && (
            <>
              <Button
                size="sm"
                color="secondary"
                variant="flat"
                isLoading={loading && selectedQuestionToDelete === question._id}
                onClick={() => {
                  deleteQuestion(question._id);
                  setSelectedQuestionToDelete(question._id);
                }}
              >
                Delete
              </Button>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onClick={() => {
                  router.push(`/questions/edit-question/${question._id}`);
                }}
              >
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };
  return (
    <Tabs
      color="primary"
      onSelectionChange={(key) => router.push(`/profile?tab=${key}`)}
    >
      <Tab title="Questions Asked" key="asked">
        <div className="flex flex-col gap-5">
          {askedQuestions.map((question) => (
            <div key={question._id}>{getQuestion(question)}</div>
          ))}
          {askedQuestions.length === 0 && getEmptyMessage()}
        </div>
      </Tab>
      <Tab title="Questions Answered" key="answered">
        <div className="flex flex-col gap-5">
          {answeredQuestions.length === 0 && getEmptyMessage()}

          {answeredQuestions.map((question) => (
            <div key={question._id}>{getQuestion(question)}</div>
          ))}
        </div>
      </Tab>
      <Tab title="Questions Saved" key="saved">
        <div className="flex flex-col gap-5">
          {savedQuestions.length === 0 && getEmptyMessage()}

          {savedQuestions.map((question) => (
            <div key={question._id}>{getQuestion(question)}</div>
          ))}
        </div>
      </Tab>
      <Tab title="Questions Commented" key="commented">
        <div className="flex flex-col gap-5">
          {commentedQuestions.length === 0 && getEmptyMessage()}

          {commentedQuestions.map((question) => (
            <div key={question._id}>{getQuestion(question)}</div>
          ))}
        </div>
      </Tab>
    </Tabs>
  );
};

export default ProfileTabs;
