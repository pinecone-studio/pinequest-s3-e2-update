"use client";

import dynamic from "next/dynamic";

const QuestionBankPage = dynamic(
  () => import("./_components/question-bank-page").then((module) => module.QuestionBankPage),
  {
    ssr: false,
  },
);

export default function Page() {
  return <QuestionBankPage />;
}
