import { getCompanyPlatformProblems } from "@/actions/company-actions";
import { toTitleCase } from "@/lib/utils";
import { Session } from "better-auth";
import CategoryCard from "@/components/DSA/CategoryCard";

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
    session?.userId
  );
  return (
    <div className="flex flex-wrap gap-4">
      {result.length > 0 ? (
        result.map((topic, index) => (
          <CategoryCard
            key={topic.slug}
            href={`/companies/${company}/${topic.slug}/${platform}`}
            category={{
              name: toTitleCase(topic.slug),
              problems: [],
              _count: {
                solved: topic.solvedCount || 0,
                problems: topic.count,
              },
            }}
            className="intersect:motion-preset-slide-up motion-delay-0 min-w-52"
            style={{ animationDelay: `${index * 50}ms` }}
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


