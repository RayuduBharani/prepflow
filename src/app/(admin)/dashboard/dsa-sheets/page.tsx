import { getCarouselsData } from "@/actions/adminActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import CarouselForm from "@/components/DSA/CarouselForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { seedDSASheets } from "@/actions/seedAction";
import { Button } from "@/components/ui/button";
import Form from "next/form";
import { extractData } from "@/actions/extractData";

const AdminDSAPage = async () => {
  const data = await getCarouselsData();
  return (
    <div className="w-full h-full pt-[5rem] px-6">
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid max-w-xs w-full grid-cols-2">
          <TabsTrigger value="view">View Carousels</TabsTrigger>
          <TabsTrigger value="add">Add Carousels</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          {data && data.length > 0 ? (
            data.map((item) => (
              <div key={item.id}>
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex flex-1 flex-wrap gap-2">
                  {item.categories.map((category) => (
                    <Accordion key={category.name} type="single" collapsible>
                      <AccordionItem value={category.name}>
                        <AccordionTrigger>{category.name}</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-2">
                          {category.problems.map((problem) => (
                            <div className="flex gap-1" key={problem.slug}>
                            <p>{problem.title}</p>
                            <p className={`${problem.difficulty === "EASY" ? 'text-green-500' : (problem.difficulty === 'MEDIUM' ? 'text-orange-500' : 'text-red-500')} ml-auto font-semibold`}>{problem.difficulty}</p>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div>No Data found, Kindly add carousels</div>
          )}
        </TabsContent>
        <TabsContent className="max-w-xs flex flex-col gap-2" value="add">
          <CarouselForm />
          <div className="flex justify-between">
          <Form action={seedDSASheets}>
            <Button size={'sm'} className="text-xs" type="submit">Seed Data</Button>
          </Form>
          <Form action={extractData}>
            <Button size={'sm'} className="text-xs" type="submit">Extract Data</Button>
          </Form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDSAPage;
