"use client";

import React from "react";
import { IQuestion } from "@/interfaces";
import { Button } from "@nextui-org/react";
import AnswerForm from "./AnswerForm";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const QuestionFooterInfo = ({
  question,
  mongodbuserId,
}: {
  question: IQuestion;
  mongodbuserId: string;
}) => {
  const [showAnswerModal, setShowAnswerModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const onSave = async () => {
    try {
      setLoading(true);
      const payload: IQuestion = question;
      payload.savedBy.push(mongodbuserId!);
      await axios.put(`/api/questions/${question._id}`, payload);
      toast.success("Question saved successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something wrong happened");
    } finally {
      setLoading(false);
    }
  };
  const removeFromSave = async () => {
    try {
      setLoading(true);
      const payload: IQuestion = question;
      payload.savedBy = payload.savedBy.filter(
        (savedBy) => savedBy !== mongodbuserId
      );
      await axios.put(`/api/questions/${question._id}`, payload);
      toast.success("Question de-saved successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something wrong happened");
    } finally {
      setLoading(false);
    }
  };
  console.log("Question--->", question);
  return (
    <div>
      <div className="flex justify-between ">
        <span className="text-sm">
          {question.totalAnswers > 0 ? question.totalAnswers : "No"} Answers
        </span>
        <div className="flex gap-5">
          {question.savedBy.includes(mongodbuserId) && (
            <Button
              size="sm"
              color="secondary"
              onClick={() => removeFromSave()}
              isLoading={loading}
            >
              Remove From Saved
            </Button>
          )}
          {!question.savedBy.includes(mongodbuserId) && (
            <Button
              size="sm"
              color="secondary"
              onClick={() => onSave()}
              isLoading={loading}
              isDisabled={question.savedBy.includes(mongodbuserId)}
            >
              Save
            </Button>
          )}
          <Button
            size="sm"
            color="secondary"
            onClick={() => setShowAnswerModal(true)}
            isDisabled={mongodbuserId === question.user._id}
          >
            Write an Answer
          </Button>
        </div>
      </div>
      {showAnswerModal && (
        <AnswerForm
          setShowAnswerForm={setShowAnswerModal}
          showAnswerForm={showAnswerModal}
          questionId={question._id}
        />
      )}
    </div>
  );
};

export default QuestionFooterInfo;
