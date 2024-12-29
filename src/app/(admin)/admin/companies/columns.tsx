"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return(
      <Image
        className="w-10 h-10 rounded-full object-cover"
        src={row.original.image || "/placeholder.png"}
        alt={row.original.name}
        width={100}
        height={100}
      />)
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
    cell : ({row}) => {
      return (
        <p className="px-4">{row.original.name}</p>
      )
    },
    
  },
];
