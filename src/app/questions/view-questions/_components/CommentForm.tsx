import { IAnswer } from "@/interfaces";
import React from "react";
import { Modal, ModalContent, Textarea, Button } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
interface CommentFormProps {
  type?: "add" | "edit";
  answer: IAnswer;
  setShowCommentForm: React.Dispatch<React.SetStateAction<boolean>>;
  showCommentForm: boolean;
  reloadData: () => void;
  initialData?: any;
}

const CommentForm = ({
  type = "add",
  answer,
  showCommentForm,
  setShowCommentForm,
  reloadData,
  initialData = null,
}: CommentFormProps) => {
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  console.log("CommentForm Initial Data", initialData);
  React.useEffect(() => {
    if (type === "edit") {
      setText(initialData.text);
    }
  }, [initialData, type]);

  const onSave = async () => {
    try {
      setLoading(true);
      if (type === "add") {
        await axios.post("/api/comments", {
          answer: answer._id,
          text,
          question: answer.question._id,
        });
        toast.success("Comment Posted Successfully");
      } else {
        await axios.put(`/api/comments/${initialData._id}`, {
          text,
        });
        toast.success("Comment updated Successfully");
      }
      reloadData();
      setShowCommentForm(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      isOpen={showCommentForm}
      onOpenChange={() => setShowCommentForm(false)}
      size="2xl"
    >
      <ModalContent>
        <div className="p-5">
          <h1 className="text-primary text-2xl">
            {type === "add" ? "Add" : "Edit"} Comment
          </h1>
          <Textarea
            placeholder="Enter Comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end gap-5 mt-5">
            <Button onClick={() => setShowCommentForm(false)}>Cancel</Button>
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              onClick={() => onSave()}
            >
              Save
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default CommentForm;
