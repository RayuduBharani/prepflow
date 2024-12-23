import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./ui/ModeToggler";
import NavbarItems from "./NavbarItems";
import { auth } from "@/auth";
import AvatarDropDown from "./AvatarDropDown";

const Navbar = async () => {
  const session = await auth();
  return (
    <NavigationMenu className="py-4 fixed">
      <NavigationMenuList className="w-screen justify-between px-12 max-md:px-2 gap-2 text-sm font-medium">
        <NavbarItems session={session} />
        <div className="flex items-center gap-2">
          <ModeToggle />
          <AvatarDropDown session={session} />
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
