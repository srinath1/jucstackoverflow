"use client";
import { IAnswer } from "@/interfaces";
import React, { useEffect } from "react";
import { dateTimeFormat } from "@/helpers/date-time-format";
import ViewCode from "@/components/ViewCode";
import { Button } from "@nextui-org/react";
import CommentForm from "./CommentForm";
import axios from "axios";
import AnswerForm from "./AnswerForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Answercard = ({
  answer,
  mongoUserId,
}: {
  answer: IAnswer;
  mongoUserId: string;
}) => {
  const [selectedAnswerForEdit, setSelectionAnswerForEdit] = React.useState<
    any | null
  >(null);
  const [comments, setComments] = React.useState([]);
  const [showCommentForm, setShowCommentForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showComments, setShowComments] = React.useState<boolean>(false);
  const [showAnswerForm, setShowAnswerForm] = React.useState<boolean>(false);
  const [selectedComment, setSelectedComment] = React.useState<any>(null);
  const [commentFormType, setCommentFormType] = React.useState<"add" | "edit">(
    "add"
  );
  const router = useRouter();
  const getComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/comments?answer=${answer._id}`);
      setComments(response.data.comments);
    } catch (error) {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };
  console.log("Answer", answer._id);
  const deleteAnswer = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/answers/${answer._id}?question=${answer.question._id}`
      );
      toast.success("Deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const deleteComment = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/comments/${id}`);
      toast.success("Comment Deleted successfully");
      getComments();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border bg-gray-100 p-3 rounded flex flex-col gap-2 mt-3 border-gray-500">
      <div className="flex gap-10 text-xs">
        <span>
          Answered On{" "}
          <span className="text-secondary">
            {dateTimeFormat(answer.updatedAt)}
          </span>
        </span>
        <span>
          By <span className="text-secondary">{answer.user.name}</span>
        </span>
      </div>
      <p className="text-xs text-gray-600 flex gap-10">{answer.description}</p>
      {answer.code && <ViewCode code={answer?.code} />}
      <div className="flex justify-between items-center mt-5">
        {!showComments ? (
          <Button
            isLoading={loading}
            size="sm"
            color="secondary"
            variant="flat"
            onClick={() => {
              setShowComments(true);
              getComments();
            }}
          >
            View Comments
          </Button>
        ) : (
          <Button
            isLoading={loading}
            onClick={() => setShowComments(false)}
            size="sm"
            color="warning"
          >
            Hide Comments
          </Button>
        )}
        <div className="flex gap-5">
          {mongoUserId === answer.user._id && (
            <>
              <Button
                onClick={() => {
                  deleteAnswer();
                }}
                size="sm"
                color="warning"
                isLoading={loading}
              >
                Delete Answer
              </Button>
              <Button
                onClick={() => {
                  setShowAnswerForm(true);
                  setSelectionAnswerForEdit(answer);
                }}
                size="sm"
                color="danger"
              >
                Edit Answer
              </Button>
            </>
          )}
          <Button
            onClick={() => setShowCommentForm(true)}
            size="sm"
            color="primary"
          >
            Add Comment
          </Button>
        </div>
      </div>
      {comments.length > 0 && showComments && (
        <div className="flex flex-col gap-2  ml-5 mt-5 ">
          {comments.map((comment: any) => (
            <div
              key={comment._id}
              className="border bg-gray-200 p-2 flex flex-col gap-2 border-gray-300"
            >
              <p className="text-sm teaxt-gray-500"> {comment.text}</p>
              <div className="flex justify-between mt-5 items-center  flex-wrap">
                <div className="flex gap-5 md:flex-wrap">
                  {comment.user._id === mongoUserId && (
                    <>
                      <Button
                        onClick={() => {
                          deleteComment(comment._id);
                          // setSelectedComment(comment);
                        }}
                        size="sm"
                        color="warning"
                        isLoading={
                          loading && selectedComment?._id === comment?._id
                        }
                      >
                        Delete Comment
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedComment(comment);
                          setShowCommentForm(true);
                          setCommentFormType("edit");
                        }}
                        size="sm"
                        color="danger"
                      >
                        Edit Comment
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex  ml-1  gap-10 text-xs">
                  <span>
                    Commented On:
                    <span className="text-secondary">
                      {dateTimeFormat(comment.createdAt)}
                    </span>
                  </span>
                  <span className="text-secondary">By:{comment.user.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showCommentForm && (
        <CommentForm
          answer={answer}
          showCommentForm={showCommentForm}
          setShowCommentForm={setShowCommentForm}
          reloadData={getComments}
          initialData={selectedComment}
          type={commentFormType}
        />
      )}
      {showAnswerForm && (
        <AnswerForm
          setShowAnswerForm={setShowAnswerForm}
          showAnswerForm={showAnswerForm}
          questionId={answer.question._id}
          initialData={selectedAnswerForEdit}
          type="edit"
        />
      )}
    </div>
  );
};

export default Answercard;
