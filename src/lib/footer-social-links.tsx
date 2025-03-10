import LinkedIn from "@/components/icons/LinkedIn"
import Github from "@/components/icons/Github"
import { Mail } from "lucide-react"
import Instagram from "@/components/icons/Instagram"

export const cygSocialLinks = [
  {
    href: "https://linkedin.com/in/cygnuxxs",
    label: "Cygnuxxs LinkedIn",
    icon: <LinkedIn size={18} />,
    hoverClass: "hover:bg-[#0077B5] hover:text-white", // LinkedIn color
  },
  {
    href: "https://github.com/cygnuxxs",
    label: "Cygnuxxs Github",
    icon: <Github size={18} />,
    hoverClass:
      "hover:bg-black hover:text-white dark:hover:bg-white/10 dark:hover:text-white", // GitHub color
  },
  {
    href: "mailto:ashok7075657409@gmail.com",
    label: "Email Cygnuxxs",
    icon: <Mail size={18} />,
    hoverClass:
      "hover:bg-black hover:text-white dark:hover:bg-white/10 dark:hover:text-white", // Neutral email color
  },
  {
    href: "https://instagram.com/cygnuxxs",
    label: "Cygnuxxs Instagram",
    icon: <Instagram size={18} />,
    hoverClass:
      "group-hover:bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 group-hover:text-white",
    isGradient: true, // Special handling for Instagram
  },
];
export const rbSocialLinks = [
  {
    href: "https://www.linkedin.com/in/rayudu-bharani-satya-siva-durga-prasad/",
    label: "Rayudu LinkedIn",
    icon: <LinkedIn size={18} />,
    hoverClass: "hover:bg-[#0077B5] hover:text-white", // LinkedIn color
  },
  {
    href: "https://github.com/RayuduBharani",
    label: "Rayudu Github",
    icon: <Github size={18} />,
    hoverClass:
      "hover:bg-black hover:text-white dark:hover:bg-white/10 dark:hover:text-white", // GitHub color
  },
  {
    href: "mailto:ashok7075657409@gmail.com",
    label: "Email Rayudu",
    icon: <Mail size={18} />,
    hoverClass:
      "hover:bg-black hover:text-white dark:hover:bg-white/10 dark:hover:text-white", // Neutral email color
  },
  {
    href: "https://www.instagram.com/bharani_rayudu/",
    label: "Rayudu Instagram",
    icon: <Instagram size={18} />,
    hoverClass:
      "group-hover:bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 group-hover:text-white",
    isGradient: true, // Special handling for Instagram
  },
];