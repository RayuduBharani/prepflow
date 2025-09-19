import { getCompanyPlatformProblems } from "@/actions/company-actions";
import { Progress } from "@/components/ui/progress";
import { toTitleCase } from "@/lib/utils";
import { ChevronsRight } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

export default async function ProblemsTab({
  company,
  platform,
  session,
}: {
  company: string;
  platform: Platform;
  session: Session | null;
}) {
  const result = await getCompanyPlatformProblems(
    company,
    platform,
    session?.user.id
  );
  return (
    <div className="flex flex-wrap gap-4">
      {result.length > 0 ? (
        result.map((topic, index) => (
          <TopicContainer
          key={index}
            index={index}
            company={company}
            platform={platform}
            solved={topic.solvedCount || 0}
            topic={topic.slug}
            progressPercentage={topic.solvedCount || 0 / topic.count}
            total={topic.count}
          />
        ))
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-lg mt-10 motion-translate-y-loop-25 text-primary">
            Not found
          </p>
        </div>
      )}
    </div>
  );
}

const TopicContainer = ({
  index,
  company,
  topic,
  platform,
  progressPercentage,
  solved,
  total,
}: {
  index: number;
  progressPercentage: number;
  company: string;
  topic: string;
  platform: string;
  solved: number;
  total: number;
}) => (
  <div
    key={index}
    className="min-w-52 cursor-pointer border 
                rounded-lg p-4 transition-all duration-300 bg-background hover:bg-muted flex-1 shadow-md intersect:motion-preset-slide-up motion-delay-0"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <Link href={`/companies/${company}/${topic}/${platform}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm">{toTitleCase(topic)}</h2>
        </div>

        <Progress value={progressPercentage} className="my-2" />

        <div className="flex justify-between items-center text-xs">
          <span>
            {solved} / {total} solved
          </span>
          <ChevronsRight className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Link>
  </div>
);
