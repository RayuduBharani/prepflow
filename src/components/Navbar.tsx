import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavbarItems from "./NavbarItems";
import { auth } from "@/auth";
import AvatarDropDown from "./AvatarDropDown";
import { ModeToggle } from "./ui/ModeToggler";
import { ThemeColorToggle } from "./theme-color-toggler";

const Navbar = async () => {
  const session = await auth();
  return (
    <NavigationMenu className="py-4 bg-background fixed">
      <NavigationMenuList className="w-screen justify-between px-6 max-md:px-2 gap-2 text-sm font-medium">
        <NavbarItems session={session} />
        <div className="flex items-center gap-2">
          <ThemeColorToggle />
          <ModeToggle />
          <AvatarDropDown session={session}/>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
