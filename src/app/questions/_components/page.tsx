"use client";
import { Input, Textarea, Button, Switch, Chip } from "@nextui-org/react";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface QuestionFormProps {
  initialData?: any;
  type?: "edit" | "add";
}

const QuestionForm = ({
  initialData = null,
  type = "add",
}: QuestionFormProps) => {
  const [loading, setLoading] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);
  const [newTag, setNewTag] = React.useState("");
  const router = useRouter();
  const [question, setQuestion] = React.useState<any>({
    title: "",
    description: "",
    code: "",
    tags: [],
  });

  console.log("ID--->", initialData);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (type === "add") {
        await axios.post("/api/questions", question);
        toast.success("Question created successfully");
      } else {
        await axios.put(`/api/questions/${initialData._id}`, question);
        toast.success("Question updated successfully");
      }
      router.refresh();
      router.back();
    } catch (error: any) {
      toast.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    if (type === "edit" && initialData) {
      setQuestion(initialData);
      if (initialData.code) setShowCode(true);
    }
  }, [initialData]);

  // const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === "Enter") {
  //     setQuestion({ ...question, tags: [...question.tags, newTag] });
  //     setNewTag("");
  //   }
  // };

  return (
    <form className="flex flex-col gap-5 " onSubmit={onSubmit}>
      <Input
        placeholder="Title"
        isRequired
        required
        label="Title"
        value={question.title}
        onChange={(e) => setQuestion({ ...question, title: e.target.value })}
        labelPlacement="outside"
      />
      <Textarea
        placeholder="description"
        isRequired
        required
        label="Description"
        value={question.description}
        onChange={(e) =>
          setQuestion({ ...question, description: e.target.value })
        }
        labelPlacement="outside"
      />
      <Switch
        placeholder="Do you want to add code"
        defaultChecked={showCode}
        onChange={() => setShowCode(!showCode)}
        isSelected={showCode}
      >
        <span className="text-gray-500"> Do you want to show code</span>
      </Switch>
      <div className="flex gap-5 items-end md:w-1/2 ">
        <Input
          placeholder="Enter new tag name"
          label="Tags"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          labelPlacement="outside"
        />
        <Button
          onClick={() => {
            setQuestion({ ...question, tags: [...question.tags, newTag] });
            setNewTag("");
          }}
        >
          Add Tags
        </Button>
      </div>
      <div className="flex gap-5">
        {question.tags.map((tag: string, index: number) => (
          <Chip
            key={index}
            color="primary"
            onClose={() => {
              setQuestion({
                ...question,
                tags: question.tags.filter((t: any) => t !== tag),
              });
            }}
          >
            {tag}
          </Chip>
        ))}
      </div>
      {showCode && (
        <CodeMirror
          value={question.code}
          height="200px"
          theme="dark"
          extensions={[javascript({ jsx: true })]}
          onChange={(value) => setQuestion({ ...question, code: value })}
          defaultValue={question.code}
        />
      )}

      <div className="flex justify-end gap-5">
        <Button onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" color="primary" isLoading={loading}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
