import {
  getCarouselsData,
  getProblemsNameandSlug,
} from "@/app/actions/adminActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import CarouselForm from "@/components/DSA/CarouselForm";

const AdminDSAPage = async () => {
  const data = await getCarouselsData();
  const problemsData = await getProblemsNameandSlug();
  return (
    <Tabs defaultValue="add" className="max-w-xs">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="view">View Carousels</TabsTrigger>
        <TabsTrigger value="add">Add Carousels</TabsTrigger>
      </TabsList>
      <TabsContent value="view">
        {data.length > 0 ? (
          data.map((category, idx1) => (
            <div>
              <h1>{category.name}</h1>
              <div className="flex flex-col">
                {category.problems.map((problem, idx2) => (
                  <div key={idx2}>
                    <h2>{problem.title}</h2>
                    <p>{problem.slug}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>No Data found, Kindly add carousels</div>
        )}
      </TabsContent>
      <TabsContent className="flex flex-col gap-2" value="add">
        <CarouselForm problemsData={problemsData.slice(0,100)} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminDSAPage;
