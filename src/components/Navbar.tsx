"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { isActive } from "@/lib/utils";
import { ModeToggle } from "./ui/ModeToggler";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import Navsheet from "./Navsheet";
import { navItems } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter()
  const handleClick = (e : React.MouseEvent<HTMLAnchorElement>, href : string) => {
    e.preventDefault()
    if (pathname !== href) {
      router.push(href)
    }
  }

  return (
    <NavigationMenu className="py-4">
      <NavigationMenuList className="w-screen justify-between px-12 max-md:px-6 gap-2 text-sm font-medium">
        <div className="flex gap-8 items-center max-sm:hidden">
          <NavigationMenuItem className="text-xl max-sm:text-lg font-bold">
            <Link onClick={(e) => handleClick(e, '/')} className={isActive('/', pathname)} href="/">PrepFlow</Link>
          </NavigationMenuItem>
          {navItems.map(({ href, label }) => (
            <NavigationMenuItem key={href}>
              <Link href={href} legacyBehavior passHref>
                <NavigationMenuLink onClick={(e) => handleClick(e, href)} className={isActive(href, pathname)}>
                  {label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </div>
        <div className="sm:hidden flex gap-2 items-center">
          <Navsheet pathname={pathname} />
          <NavigationMenuItem className="text-xl max-sm:text-lg font-bold">
            <Link className={isActive('/', pathname)} href="/">PrepFlow</Link>
          </NavigationMenuItem>
        </div>
        <div className="flex gap-2">
          <ModeToggle />
          <Button asChild effect={'expandIcon'} iconPlacement="right" icon={LogIn}>
            <Link onClick={(e) => handleClick(e, '/signin')} href={'/signin'}>Sign in</Link>
          </Button>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
