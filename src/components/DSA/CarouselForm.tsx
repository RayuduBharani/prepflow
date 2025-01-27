"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import ProblemsMultiSelect from "./ProblemsCombobox";

interface CategoryEntry {
  id: string;
  category: string;
  problems: Array<{ title: string; slug: string }>;
}

const CarouselForm = () => {
  const [carouselName, setCarouselName] = useState<string>("");
  const [entries, setEntries] = useState<CategoryEntry[]>([
    { id: crypto.randomUUID(), category: "", problems: [] },
  ]);

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      { id: crypto.randomUUID(), category: "", problems: [] },
    ]);
  };

  const handleRemoveEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const handleCategoryChange = (id: string, value: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, category: value } : entry
      )
    );
  };

  const handleProblemsChange = (
    id: string,
    problems: Array<{ title: string; slug: string }>
  ) => {
    setEntries(
      entries.map((entry) => (entry.id === id ? { ...entry, problems } : entry))
    );
  };

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     onSubmit({
  //       carouselName,
  //       categories: entries
  //     });
  //   };

  return (
    <>
      <Input
        placeholder="Enter the Carousel Name"
        value={carouselName}
        onChange={(e) => setCarouselName(e.target.value)}
        required
      />

      {entries.map((entry, index) => (
        <div key={entry.id} className="flex flex-col gap-3">
          <div className="flex flex-col p-1 gap-1 bg-muted rounded-md items-start">
            <div className="flex gap-2 w-full">
            <Input
                placeholder="Enter the Category (ex: Strings)"
                value={entry.category}
                className="bg-background w-full"
                onChange={(e) => handleCategoryChange(entry.id, e.target.value)}
                required
              />
              {entries.length > 1 && (
              <Button
                type="button"
                variant={'destructive'}
                size="sm"
                onClick={() => handleRemoveEntry(entry.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            </div>
              
            <ProblemsMultiSelect
                maxHeight="15rem"
                placeholder="Search for problems..."
                onChange={(selected) =>
                  handleProblemsChange(entry.id, selected)
                }
              />
          </div>

          {index === entries.length - 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-sm font-normal"
              onClick={handleAddEntry}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Category
            </Button>
          )}
        </div>
      ))}

      <Button type="submit" className="mt-4">
        Save Carousel
      </Button>
    </>
  );
};

export default CarouselForm;
