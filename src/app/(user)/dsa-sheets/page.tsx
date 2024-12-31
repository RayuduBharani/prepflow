import { CircleArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { getMainTopics } from "@/app/actions/actions";
import { toTitleCase } from "@/lib/utils";

const DSAPage = async () => {
  const mainTopics = await getMainTopics();
  return (
    <div className="w-full h-full pt-[4rem] sm:px-10 overflow-hidden">
      <div className="w-full h-full overflow-y-scroll scrollbar-hide p-0">
        <h1 className="text-lg font-bold mt-7 text-primary sm:px-2 max-sm:px-4">
          DSA Practice Sheet
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 sm:px-2 max-sm:px-4">
          Explore and solve various DSA problems to enhance your skills.
        </p>
        <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 justify-center p-3 overflow-y-scroll scrollbar-hide">
          {mainTopics.length > 0 ? (
            mainTopics.map((topic, index) => {
              return (
                <div
                  key={index}
                  className="bg-muted w-full h-fit rounded-lg flex p-4 flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-base font-semibold">
                      {toTitleCase(topic.name)}
                    </h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      10 / {topic._count.problems}
                    </p>
                  </div>
                  <div className="flex gap-4 justify-between items-center">
                    <Progress value={20} />
                    <Link href={`dsa-sheets/${topic.name}`}>
                      <CircleArrowRight size={20} className="cursor-pointer" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No topics</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSAPage;
