import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PythonIcon from "@/components/icons/Python";
import CppIcon from "@/components/icons/CppIcon";
import CIcon from "@/components/icons/CIcon";
import JavaIcon from "@/components/icons/JavaIcon";
import JavascriptIcon from "@/components/icons/JavascriptIcon";
import { useLanguageStore } from "@/store/compilerStore";

const LanguageSelector = () => {
  const languages = [
    { name: "Python", value: "python", Icon: PythonIcon },
    { name: "C++", value: "cpp", Icon: CppIcon },
    { name: "C", value: "c", Icon: CIcon },
    { name: "Java", value: "java", Icon: JavaIcon },
    { name: "Javascript", value: "javascript", Icon: JavascriptIcon },
    // { name: "Typescript", value: "typescript", Icon: TypescriptIcon },
  ];

  const { language, setLanguage } = useLanguageStore();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="h-9">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((item, idx) => (
          <SelectItem
            key={idx}
            value={item.value}
          >
            <div className="flex items-center gap-2">
            <item.Icon size={20} />
            {item.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
