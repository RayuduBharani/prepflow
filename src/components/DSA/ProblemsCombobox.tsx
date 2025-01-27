"use client";

import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ChevronsUpDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";

interface Option {
  title: string;
  slug: string;
}

interface MultiSelectProps {
  placeholder?: string;
  onChange?: (selectedItems: Option[]) => void;
  maxHeight?: string;
}

const fetchOptions = async (search: string): Promise<Option[]> => {
  const response = await fetch(`/api/options?search=${search}`);
  if (!response.ok) {
    throw new Error("Failed to fetch options");
  }
  return response.json();
};

const ProblemsMultiSelect: React.FC<MultiSelectProps> = ({
  placeholder = "Select items...",
  onChange,
  maxHeight = "15rem",
}) => {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Option[]>([]);
  const [search, setSearch] = useState("");

  const { data: options = [], isLoading, isError } = useQuery(
    ["options", search],
    () => fetchOptions(search),
    { keepPreviousData: true }
  );

  const handleSelect = (item: Option): void => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.slug === item.slug);
      const updated = isSelected
        ? prev.filter((selected) => selected.slug !== item.slug)
        : [...prev, item];
      onChange?.(updated);
      return updated;
    });
  };

  const handleRemove = (
    itemToRemove: Option,
    e: React.MouseEvent | React.KeyboardEvent
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItems((prev) => {
      const updated = prev.filter((item) => item.slug !== itemToRemove.slug);
      onChange?.(updated);
      return updated;
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between hover:bg-background relative h-full min-h-10"
        >
          <div className="flex w-[90%] items-center overflow-x-auto scrollbar-none">
            {selectedItems.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex gap-1 flex-nowrap">
                {selectedItems.map((item) => (
                  <Badge
                    key={item.slug}
                    variant="secondary"
                    className="whitespace-nowrap my-1 px-2 py-0 flex items-center"
                  >
                    {item.title}
                    <span
                      role="button"
                      tabIndex={0}
                      className="ml-1 cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => handleRemove(item, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleRemove(item, e);
                        }
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-50" align="start">
        <Command className="max-h-full">
          <CommandInput
            placeholder="Search items..."
            value={search}
            onValueChange={setSearch}
          />
          {isLoading ? (
            <div className="p-4">Loading...</div>
          ) : isError ? (
            <div className="p-4 text-red-500">Error fetching data.</div>
          ) : (
            <div
              className="overflow-y-auto"
              style={{ maxHeight }}
            >
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup className="w-full max-w-xs">
                {options.map((item) => {
                  const isSelected = selectedItems.some(
                    (selected) => selected.slug === item.slug
                  );
                  return (
                    <CommandItem
                      key={item.slug}
                      onSelect={() => handleSelect(item)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {item.title}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProblemsMultiSelect;
