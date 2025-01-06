import { getCompanies } from "@/app/actions/actions";
import { auth } from "@/auth";
import React from "react";

const CompaniesPage = async () => {
  const session = await auth();
  const companiesData = await getCompanies(session?.user.id);
  return (
    <div className="w-full h-full pt-[4rem] overflow-hidden">
      <>
        <div className="flex flex-1 gap-2 justify-between">
          <h1 className="text-xl font-bold text-primary">
            Company Wise Questions
          </h1>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          A collection of questions asked by various companies in their
          interviews
        </p>

        <div className="w-full h-[86%] mt-2 overflow-y-scroll scrollbar-hide">
          <div className="gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] grid flex-1">
            {companiesData &&
              companiesData.map((company) => (
                <div
                  className="p-2 bg-muted rounded-md flex flex-col gap-1 flex-1 h-[5rem]"
                  key={company.id}
                >
                  <p className="text-sm font-medium">{company.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user
                      ? `Solved : ${company.solvedProblems}/${company.totalProblems}`
                      : `Total : ${company.totalProblems}`}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </>
    </div>
  );
};

export default CompaniesPage;
