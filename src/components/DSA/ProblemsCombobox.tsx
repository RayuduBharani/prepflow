"use client";

import React, { useState, useEffect } from "react";
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

interface Option {
  title: string;
  slug: string;
}

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (selectedItems: Option[]) => void;
  maxHeight?: string;
}

const ProblemsMultiSelect: React.FC<MultiSelectProps> = ({
  options,
  placeholder = "Select items...",
  onChange,
  maxHeight = "15rem",
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Option[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (item: Option): void => {
    const isSelected = selectedItems.some((selected) => selected.slug === item.slug);
    
    let updated: Option[];
    if (isSelected) {
      updated = selectedItems.filter((selected) => selected.slug !== item.slug);
    } else {
      updated = [...selectedItems, item];
    }
    
    setSelectedItems(updated);
    onChange?.(updated);
  };

  const handleRemove = (itemToRemove: Option, e: React.MouseEvent | React.KeyboardEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    const updated = selectedItems.filter(item => item.slug !== itemToRemove.slug);
    setSelectedItems(updated);
    onChange?.(updated);
  };

  if (!mounted) {
    return null;
  }

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
                      onMouseDown={(e: React.MouseEvent): void => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e: React.MouseEvent): void => handleRemove(item, e)}
                      onKeyDown={(e: React.KeyboardEvent): void => {
                        if (e.key === 'Enter' || e.key === ' ') {
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
      <PopoverContent className="w-full p-0" align="start">
        <Command className="max-h-full">
          <CommandInput placeholder="Search items..." />
          <CommandEmpty>No items found.</CommandEmpty>
          <div className="max-h-[var(--cmd-height)] overflow-y-auto" style={{ "--cmd-height": maxHeight } as React.CSSProperties}>
            <CommandGroup className="w-full max-w-xs">
              {options.map((item) => {
                const isSelected = selectedItems.some(
                  (selected) => selected.slug === item.slug
                );
                return (
                  <CommandItem
                    key={item.slug}
                    onSelect={(): void => handleSelect(item)}
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
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProblemsMultiSelect;