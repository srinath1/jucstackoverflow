import { User } from "@clerk/nextjs/server";
import { connectDB } from "@/config/db";
import { handleNewUserRegistration } from "@/actions/users";
import Link from "next/link";
import Filters from "@/components/Filters";
import QuestionModel from "@/models/QuestionModel";
import { IQuestion } from "@/interfaces";
import QuestionCard from "@/components/QuestionCard";
connectDB();
interface HomeProps {
  searchParams: {
    tag: string;
    search: string;
  };
}
export default async function Home({ searchParams }: HomeProps) {
  await handleNewUserRegistration();

  console.log("Tag SearchParams", searchParams);
  const { tag, search } = searchParams;
  let filterObject = {};
  if (tag) {
    filterObject = {
      tags: {
        $in: [tag],
      },
    };
  }
  if (search) {
    filterObject = {
      title: {
        $regex: search,
        $options: "i",
      },
    };
  }
  console.log("Filter Obj", filterObject);
  const questions: IQuestion[] = await QuestionModel.find(filterObject)
    .sort({ createdAt: -1 })
    .populate("user");
  return (
    <div>
      <div className="flex justify-end ">
        <Link
          className="bg-primary text-white px-4 py-2 rounded"
          href="/questions/new-questions"
        >
          Ask a Question
        </Link>
      </div>
      <Filters />
      <div className="flex flex-col gap-5">
        {questions.map((question) => (
          <QuestionCard
            key={question._id}
            question={JSON.parse(JSON.stringify(question))}
          />
        ))}
      </div>
    </div>
  );
}
