"use client";

import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";
import Leetcode from "@/components/icons/Leetcode";
import GFGIcon from "@/components/icons/GFG";
import { searchProblems } from "@/actions/adminActions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronsUpDown, Check } from "lucide-react";

interface Option {
  title: string;
  slug: string;
  difficulty?: string;
  platform: string;
}

interface MultiSelectProps {
  placeholder?: string;
  onChange?: (selectedSlugs: string[]) => void;
  maxHeight?: string;
}

const ProblemsCombobox: React.FC<MultiSelectProps> = ({
  placeholder = "Select Problems...",
  onChange,
  maxHeight = "15rem",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { data: options = [], isFetching } = useQuery({
    queryKey: ["problems", debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch.length > 2) {
        return searchProblems(debouncedSearch);
      }
      return searchProblems("");
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleSelect = (item: Option): void => {
    const isSelected = selectedSlugs.includes(item.slug);
    const updated = isSelected
      ? selectedSlugs.filter((slug) => slug !== item.slug)
      : [...selectedSlugs, item.slug];
    setSelectedSlugs(updated);
    onChange?.(updated);
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  };

  const handleRemove = (slugToRemove: string): void => {
    const updated = selectedSlugs.filter((slug) => slug !== slugToRemove);
    setSelectedSlugs(updated);
    onChange?.(updated);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="justify-between w-full hover:bg-background relative h-full min-h-10"
        >
          <div className="flex w-full items-center overflow-x-auto scrollbar-hide">
            {selectedSlugs.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex gap-1 flex-nowrap">
                {selectedSlugs.map((slug) => {
                  const item = options.find((option) => option.slug === slug);
                  return (
                    <Badge
                      key={slug}
                      variant="secondary"
                      className="whitespace-nowrap my-1 px-2 py-0 flex items-center"
                    >
                      {item?.title || slug}
                      <input name="problem" defaultValue={item?.slug} hidden />
                      <span
                        role="button"
                        tabIndex={0}
                        className="ml-1 cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                        onMouseDown={(e: React.MouseEvent): void => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e: React.MouseEvent): void =>
                          handleRemove(slug)
                        }
                        onKeyDown={(e: React.KeyboardEvent): void => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleRemove(slug);
                          }
                        }}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </span>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 max-h-[15rem]">
        <Command>
          <CommandInput
            placeholder="Search problems..."
            value={searchTerm}
            ref = {searchInputRef}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>
            {isFetching ? "Loading..." : "No problems found."}
          </CommandEmpty>
          <div
            className="max-h-[var(--cmd-height)] overflow-y-auto"
            style={{ "--cmd-height": maxHeight } as React.CSSProperties}
          >
            <CommandGroup className="max-w-xs">
              {options.map((option) => (
                <CommandItem
                  key={option.slug}
                  value={option.slug}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSlugs.includes(option.slug)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.title}
                  <div className="ml-auto">
                    {option.platform === "GFG" ? <GFGIcon /> : <Leetcode />}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProblemsCombobox;
