import { Input } from "@/components/ui/input";
import Form from "next/form";
import React from "react";

const CompaniesPage = () => {
  return (
    <div className="w-full h-full pt-[5rem] px-6 max-sm:px-3">
      <div className="w-full">
        <Form action={async (formData)=> {
          'use server'
        }}>
        <Input
          className="placeholder:text-sm max-w-md mx-auto"
          placeholder="Search for your Favourite Companies"
        />
        </Form>

      </div>
    </div>
  );
};

export default CompaniesPage;
