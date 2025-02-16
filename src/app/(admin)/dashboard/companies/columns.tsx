"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import UpdateDialog from "./UpdateDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Define image filter states
type ImageFilterState = "all" | "no-images" | "updated";

interface Company {
  id: string | number;
  name: string;
  image: string | null;
}

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <div className="px-4">{row.getValue("id")}</div>;
    },
  },
  {
    accessorKey: "image",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-center gap-2">
          <span>Image</span>
          <Select
            onValueChange={(value: ImageFilterState) => {
              column.setFilterValue(value);
            }}
            defaultValue="all"
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="no-images">No Images</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    },
    cell: ({ row }) => {
      const image = row.getValue("image") as string | null;
      return (
        <div className="flex justify-center">
          <Image
            className={cn('w-16 h-10 p-1 object-contain overflow-hidden bg-white rounded-sm object-center', !image && 'p-0 object-cover')}
            src={image && image !== 'None' ? image : '/placeholder.png'}
            alt={row.getValue("name") as string}
            width={100}
            height={100}
            priority={false}
          />
        </div>
      );
    },
    filterFn: (row, id, filterValue: ImageFilterState) => {
      const image = row.original.image;
      
      switch (filterValue) {
        case "no-images":
          return image === null || image === "";
        case "updated":
          return image !== null && image !== "";
        case "all":
        default:
          return true;
      }
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="px-4">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "update",
    header: "Update Image",
    cell: ({ row }) => {
      return (
        <UpdateDialog 
          name={row.getValue("name") as string} 
          image={row.getValue("image") as string | null} 
        />
      );
    },
  },
];