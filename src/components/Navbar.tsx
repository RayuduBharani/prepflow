import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavbarItems from "./NavbarItems";
import { auth } from "@/auth";
import AvatarDropDown from "./AvatarDropDown";
import { ModeToggle } from "./ui/ModeToggler";
import Navsheet from "./Navsheet";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ThemeColorToggle } from "./theme-color-toggler";

const Navbar = async () => {
  const session = await auth();
  return (
    <div className="py-4 fixed z-10 w-screen justify-center bg-background px-6 max-md:px-3">
      <NavigationMenu className="gap-2 mx-auto max-w-screen-2xl bg-background text-sm font-medium">
      <NavigationMenuList className="flex gap-8 items-center max-md:hidden">
        <NavbarItems session={session} />
      </NavigationMenuList>
      <div className="md:hidden flex gap-2 items-center">
        <Navsheet session={session} />
        <NavigationMenuItem asChild
          tabIndex={0}
          className="text-xl max-sm:text-lg font-bold"
        >
          <Link className="text-primary" href="/">
            PrepFlow
          </Link>
        </NavigationMenuItem>
      </div>
      <div className="flex items-center ml-auto gap-2">
          <ThemeColorToggle />
          <ModeToggle />
          <AvatarDropDown session={session}/>
        </div>
    </NavigationMenu>
    </div>
  );
};

export default Navbar;
