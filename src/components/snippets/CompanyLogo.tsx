"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";

type Framework = {
  label: string;
  value: number;
  image: string;
};

export function CompanyLogo({
  companyName,
  name = "companyId",
}: {
  companyName: { id: number; name: string; image: string }[] | null;
  name?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");

  const frameworks: Framework[] =
    companyName?.map((company) => ({
      label: company.name,
      value: company.id,
      image: company.image,
    })) || [];

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {value && frameworks.length > 0
              ? frameworks.find(
                  (framework) => framework.value.toString() === value
                )?.label
              : "Select framework..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value.toString()}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.value.toString()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <Image
                      src={framework.image}
                      alt={framework.label}
                      className="h-6 w-6 object-contain"
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
