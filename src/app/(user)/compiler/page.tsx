import { Metadata } from "next";
import Compiler from "./compiler";
import { metadata as defaultMetadata } from "@/lib/defaultMetadata";
export const metadata: Metadata = {
  ...defaultMetadata,
  title: {
    default: "PrepFlow - Online Python Compiler",
    template: "%s | Prepflow",
  },
  description:
    "Prepflow Online Python Compiler - Compile and run your code online instantly. Supports Python for now.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "PrepFlow - Online Python Compiler",
    description:
      "Run and compile code instantly in your browser. Supports Python for now.",
    url: "https://prepflow.vercel.app/compiler",
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: "PrepFlow - Online Code Compiler",
    description:
      "Compile and run code instantly in your browser. Supports C, C++, Java, Python, JavaScript, and more.",
    images: ["https://prepflow.vercel.app/og-compiler.png"],
  },
  alternates : {
    canonical : 'https://prepflow.vercel.app/compiler'
  }
};

export default function CompilerPage() {
  return (
    <div className="h-full w-full min-h-screen pt-16 px-2 sm:px-1">
      <Compiler />
    </div>
  );
}
