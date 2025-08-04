import { Metadata } from "next";
import Compiler from "./compiler"
export const metadata : Metadata = {
  title : 'PrepFlow - Compiler',
  description : "Compile and Run Your Code Online"
}

export default function CompilerPage() {
  return (
    <div className="h-full w-full min-h-screen pt-[4rem] px-2 sm:px-1">
      <Compiler/>
    </div>
  );
}