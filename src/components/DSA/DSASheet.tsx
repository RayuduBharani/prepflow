import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import CategoryCard from "./CategoryCard"
import { toSlug } from "@/lib/utils"


const DSASheet: React.FC<{ carousel: ICarousel }> = async ({ carousel }) => {
  return (
    <div id={toSlug(carousel.name)} className="w-full">
      <Accordion type="single" collapsible defaultValue={carousel.name}>
        <AccordionItem value={carousel.name} className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-2 sm:py-3 transition-colors rounded-lg px-2 hover:bg-muted/50 data-[state=open]:text-primary">
            <h2 className="font-semibold text-xl sm:text-2xl text-left tracking-tight">{carousel.name}</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-2">
            <div className="flex flex-wrap w-full gap-4">
              {carousel.categories.map((category) => (
                <CategoryCard carouselName={carousel.name} category={category} key={category.name} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default DSASheet