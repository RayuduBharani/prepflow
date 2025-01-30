import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import CategoryAccordion from "./CategoryAccordion"
import { toSlug } from "@/lib/utils"


const DSASheet : React.FC<{carousel : ICarousel}> = async ({carousel}) =>  {
  return (
    <div id={toSlug(carousel.name)} className="w-full py-4">
      <Accordion type="single" collapsible defaultValue={carousel.name}>
        <AccordionItem value={carousel.name}>
          <AccordionTrigger className="hover:no-underline">
      <h1 className="font-semibold">{carousel.name}</h1>
          </AccordionTrigger>
          <AccordionContent>
          <div className="mt-2 flex flex-wrap w-full gap-x-4 gap-y-2">
        {carousel.categories.map((category, idx) => (
          <CategoryAccordion carouselName = {carousel.name} category={category} key={idx} />
        ))}
      </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default DSASheet