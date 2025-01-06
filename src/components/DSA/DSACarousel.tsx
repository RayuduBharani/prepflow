import * as React from "react"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function DSACarousel() {
  return (
       <Carousel
      opts={{
        align: "start",
        slidesToScroll : 4
      }}
      className="w-full"
    >
      <CarouselContent>
        {Array.from({ length: 16 }).map((_, index) => (
          <CarouselItem className="basis-36" key={index}>
              <Card className="rounded-sm">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant={'ghost'} className="max-sm:hidden h-full absolute left-0" />
      <CarouselNext variant={'ghost'} className="max-sm:hidden h-full absolute right-0" />
    </Carousel>
  )
}
