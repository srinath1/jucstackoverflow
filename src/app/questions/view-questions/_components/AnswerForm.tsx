import React from "react";
import {
  Modal,
  ModalContent,
  Textarea,
  Switch,
  Button,
} from "@nextui-org/react";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AnswerFormProps {
  showAnswerForm: boolean;
  setShowAnswerForm: React.Dispatch<React.SetStateAction<boolean>>;
  type?: "edit" | "add";
  questionId: string;
  initialData?: any;
}

const AnswerForm = ({
  showAnswerForm,
  setShowAnswerForm,
  type = "add",
  questionId,
  initialData,
}: AnswerFormProps) => {
  const [answer, setAnswer] = React.useState<any>({
    description: "",
    code: "",
  });
  const [showCode, setShowCode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  console.log("InitialData", initialData);
  console.log("questionId", questionId);
  const onSave = async () => {
    try {
      setLoading(true);
      answer.question = questionId;
      if (!showCode) {
        answer.code = "";
      }
      if (type === "add") {
        await axios.post("/api/answers", answer);
        toast.success("Answer sent successfully");
      } else {
        await axios.put(`/api/answers/${initialData._id}`, answer);
        toast.success("Answer Updated Successfully");
      }
      router.refresh();
      setShowAnswerForm(false);
    } catch (error: any) {
      toast.error(error.response.data.message || error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    if (type === "edit") {
      setAnswer(initialData);
      if (initialData.code) {
        setShowCode(true);
      }
    }
  }, [initialData, type]);
  return (
    <Modal
      isOpen={showAnswerForm}
      onOpenChange={() => setShowAnswerForm(false)}
      size="4xl"
    >
      <ModalContent>
        <div className="p-5 flex flex-col gap-5">
          <h1 className="text-primary text-xl">
            {type === "add" ? "Add" : "Edit"} Answer
          </h1>
          <Textarea
            placeholder="Description of your answer"
            value={answer.description}
            label="Description"
            labelPlacement="outside"
            onChange={(e) =>
              setAnswer({ ...answer, description: e.target.value })
            }
          />
          <Switch
            placeholder="Do you want to add code"
            defaultChecked={showCode}
            onChange={() => setShowCode(!showCode)}
            isSelected={showCode}
          >
            <span className="text-gray-500"> Do you want to show code</span>
          </Switch>
          {showCode && (
            <CodeMirror
              value={answer.code}
              height="200px"
              theme="dark"
              extensions={[javascript({ jsx: true })]}
              onChange={(value) => setAnswer({ ...answer, code: value })}
              defaultValue={answer.code}
            />
          )}
          <div className="flex justify-end gap-5">
            <Button onClick={() => setShowAnswerForm(false)}>Cancel</Button>
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

export default AnswerForm;
