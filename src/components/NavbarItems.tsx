"use client";
import React from "react";
import { NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Navsheet from "./Navsheet";
import { navItems, isActive } from "@/lib/utils";

const NavbarItems = () => {
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (pathname !== href) {
      router.push(href);
    }
  };
  return (
    <>
      <div className="flex gap-8 items-center max-sm:hidden">
        <NavigationMenuItem className="text-xl max-sm:text-lg font-bold">
          <Link
            onClick={(e) => handleClick(e, "/")}
            className={isActive("/", pathname)}
            href="/"
          >
            PrepFlow
          </Link>
        </NavigationMenuItem>
        {navItems.map(({ href, label }) => (
          <NavigationMenuItem key={href}>
            <Link href={href} legacyBehavior passHref>
              <NavigationMenuLink
                onClick={(e) => handleClick(e, href)}
                className={isActive(href, pathname)}
              >
                {label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <Link href={"/admin/dashboard"} legacyBehavior passHref>
            <NavigationMenuLink
              onClick={(e) => handleClick(e, "/admin/dashboard")}
              className={isActive("/admin/dashboard", pathname)}
            >
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </div>
      <div className="sm:hidden flex gap-2 items-center">
        <Navsheet pathname={pathname} />
        <NavigationMenuItem className="text-xl max-sm:text-lg font-bold">
          <Link className="text-primary" href="/">
            PrepFlow
          </Link>
        </NavigationMenuItem>
      </div>
    </>
  );
};

export default NavbarItems;
