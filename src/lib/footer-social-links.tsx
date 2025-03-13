import LinkedIn from "@/components/icons/LinkedIn";
import Github from "@/components/icons/Github";
import Instagram from "@/components/icons/Instagram";
import { Mail } from "lucide-react";

interface Developer {
  name: string;
  links: SocialLink[];
}
interface SocialLink {
  href: string;
  icon: React.ReactNode;
  hoverClass: string;
}
export const SOCIAL_LINKS: Developer[] = [
  {
    name: "Cygnuxxs",
    links: [
      { href: "https://linkedin.com/in/cygnuxxs", icon: <LinkedIn />, hoverClass: "hover:bg-[#0077B5] hover:text-white" },
      { href: "https://github.com/cygnuxxs", icon: <Github />, hoverClass : 'hover:bg-white hover:text-black' },
      { href: "mailto:ashok7075657409@gmail.com", icon: <Mail />, hoverClass: "hover:bg-black hover:text-white" },
      { href: "https://instagram.com/cygnuxxs", icon: <Instagram />, hoverClass: "group-hover:bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600" },
    ],
  },
  {
    name: "Rayudu Bharani",
    links: [
      { href: "https://linkedin.com/in/rayudu-bharani", icon: <LinkedIn />, hoverClass: "hover:bg-[#0077B5] hover:text-white" },
      { href: "https://github.com/RayuduBharani", icon: <Github />, hoverClass: "hover:bg-black hover:text-white" },
      { href: "mailto:ashok7075657409@gmail.com", icon: <Mail />, hoverClass: "hover:bg-black hover:text-white" },
      { href: "https://instagram.com/bharani_rayudu", icon: <Instagram />, hoverClass: "group-hover:bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600" },
    ],
  },
];