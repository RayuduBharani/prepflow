"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
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
  CommandList, // <-- Added import
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronsUpDown, Check, Search, Loader2 } from "lucide-react";

interface Option {
  title: string;
  slug: string;
  difficulty?: string;
  platform: string;
}

const EMPTY_SLUGS: string[] = [];

interface MultiSelectProps {
  placeholder?: string;
  onChange?: (selectedSlugs: string[]) => void;
  maxHeight?: string;
  initialSlugs?: string[];
  categoryIndex?: number;
}

const ProblemsCombobox: React.FC<MultiSelectProps> = ({
  placeholder = "Select Problems...",
  onChange,
  maxHeight = "15rem",
  initialSlugs = EMPTY_SLUGS,
  categoryIndex = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleCacheRef = useRef<Record<string, string>>({});

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch problems based on search input
  const { data: options = [], isFetching } = useQuery({
    queryKey: ["problems", debouncedSearch],
    queryFn: async ({ signal }) => {
      if (debouncedSearch.length <= 2) return [];
      const results = await searchProblems(debouncedSearch);
      if (signal?.aborted) throw new Error("Query was cancelled");
      return results;
    },
    enabled: debouncedSearch.length > 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Accumulate title cache when options update
  useEffect(() => {
    if (options.length > 0) {
      options.forEach((opt) => {
        titleCacheRef.current[opt.slug] = opt.title;
      });
    }
  }, [options]);

  // Handle selection using state updater functions to prevent stale closures
  const handleSelect = useCallback(
    (item: Option) => {
      const isSelected = selectedSlugs.includes(item.slug);
      const newSelected = isSelected
        ? selectedSlugs.filter((slug) => slug !== item.slug)
        : [...selectedSlugs, item.slug];

      setSelectedSlugs(newSelected);

      // Call onChange outside of state updater to prevent React warning
      onChange?.(newSelected);

      // Focus input after selection
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [onChange, selectedSlugs]
  );

  const handleRemove = useCallback(
    (slugToRemove: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const updated = selectedSlugs.filter((slug) => slug !== slugToRemove);
      setSelectedSlugs(updated);

      // Call onChange outside of state updater to prevent React warning
      onChange?.(updated);
    },
    [onChange, selectedSlugs]
  );

  const getDisplayTitle = (slug: string) => {
    return (
      titleCacheRef.current[slug] ||
      slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-controls="problems-combobox"
          aria-expanded={isOpen}
          className="justify-between w-full hover:bg-background relative h-auto min-h-10 py-2"
        >
          <div className="flex flex-wrap gap-1.5 items-center flex-1">
            {selectedSlugs.length === 0 ? (
              <span className="text-muted-foreground flex items-center gap-2">
                <Search className="h-4 w-4" />
                {placeholder}
              </span>
            ) : (
              // eslint-disable-next-line react-hooks/refs
              selectedSlugs.map((slug, idx) => (
                <Badge
                  key={slug}
                  variant="secondary"
                  className="whitespace-nowrap px-2 py-0.5 flex items-center gap-1 text-xs"
                >
                  {getDisplayTitle(slug)}
                  <input name={`problem-${categoryIndex}`} defaultValue={slug} hidden />
                  <span
                    role="button"
                    tabIndex={0}
                    className="ml-0.5 cursor-pointer rounded-full hover:bg-muted-foreground/20 p-0.5"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => handleRemove(slug, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleRemove(slug);
                      }
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            placeholder="Type at least 3 characters to search..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList style={{ maxHeight }}>
            <CommandEmpty>
              {isFetching ? (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-muted-foreground">Searching...</span>
                </div>
              ) : searchTerm.length < 3 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Type at least 3 characters to search
                </div>
              ) : (
                "No problems found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.slug}
                  value={option.slug}
                  onSelect={() => handleSelect(option)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      selectedSlugs.includes(option.slug)
                        ? "opacity-100 text-green-500"
                        : "opacity-0"
                    )}
                  />
                  <span className="flex-1 truncate">{option.title}</span>
                  <div className="ml-2 shrink-0">
                    {option.platform === "GFG" ? <GFGIcon /> : <Leetcode />}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProblemsCombobox;