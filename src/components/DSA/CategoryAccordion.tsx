import { ChevronsRight } from "lucide-react";
import { Progress } from "../ui/progress";
import Link from "next/link";
import { toSlug } from "@/lib/utils";

const CategoryAccordion = ({
  category,
  carouselName,
}: {
  carouselName: string;
  category: {
    name: string;
    problems: { title: string; slug: string; difficulty: string }[];
    _count: { solved: number; problems: number };
  };
}) => {
  return (
    <Link
      href={`/dsa-sheets/${toSlug(carouselName)}/${toSlug(category.name)}`}
      className="border shadow-md max-sm:text-xs hover:bg-secondary transition-colors duration-200 ease-in-out flex flex-col gap-2 sm:text-sm basis-56 flex-grow rounded-lg p-4"
    >
      <p>{category.name}</p>
      <Progress
        value={(category._count.solved / category._count.problems) * 100}
      />
      <p className="text-xs flex w-full">
        {category._count.solved}/{category._count.problems} solved
        <span className="ml-auto">
          <ChevronsRight className="text-primary" size={18} />
        </span>
      </p>
    </Link>
  );
};

export default CategoryAccordion;
