import React, { Suspense } from "react";
import Upload from "./Upload";
import Loading from "@/app/loading";

const AtsPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full px-6 max-md:px-3 h-svh pt-[5rem]">
        <div className="flex justify-center items-center gap-3">
          <h1 className="font-bold bg-gradient-to-r dark:from-pink-500 from-pink-600 to-violet-600 dark:to-violet-500 bg-clip-text text-transparent w-fit text-xl">ATS Checker</h1>
          <p className="w-fit mx-0 shadow dark:shadow-0 text-xs border rounded-full py-1 px-2">Supports .pdf, .docx</p>
        </div>
        <Upload />
      </div>
    </Suspense>
  );
};

export default AtsPage;
