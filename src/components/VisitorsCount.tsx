// import { getVisitorsCount } from "@/actions/visitorsActions";
import { formatIndianCount, getLabel } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const VisitorsCount = async () => {
  // const count = await getVisitorsCount();
  return (
    <span className="text-xs px-2 py-1 w-full text-start font-medium text-muted-foreground flex items-center gap-4">
      Visitors
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
<span className="text-primary font-bold text-xl">{formatIndianCount(1)}</span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{1} {getLabel(1)}</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
    </span>
  );
};

export default VisitorsCount;
