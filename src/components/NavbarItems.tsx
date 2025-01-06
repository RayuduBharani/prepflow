"use client";
import React from "react";
import { NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Navsheet from "./Navsheet";
import type { Session } from "next-auth";
import { navItems, isActive } from "@/lib/utils";

const NavbarItems: React.FC<{ session: Session | null }> = ({ session }) => {
  const router = useRouter();
  const pathname = '/' + usePathname().split('/')[1];
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
      <div className="flex gap-8 items-center max-md:hidden">
        <NavigationMenuItem tabIndex={0} className="text-xl max-sm:text-lg font-bold">
          <Link
            onClick={(e) => handleClick(e, "/")}
            className={isActive("/", pathname)}
            href="/"
          >
            PrepFlow
          </Link>
        </NavigationMenuItem>
        {navItems.map(({ href, label }) => (
          <NavigationMenuItem tabIndex={0} key={href}>
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
        {session?.user.role === "ADMIN" && (
          <NavigationMenuItem tabIndex={0}>
            <Link href={"/dashboard"} legacyBehavior passHref>
              <NavigationMenuLink
                onClick={(e) => handleClick(e, "/dashboard")}
                className={isActive("/dashboard", pathname)}
              >
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </div>
      <div className="md:hidden flex gap-2 items-center">
        <Navsheet session={session} pathname={pathname} />
        <NavigationMenuItem tabIndex={0} className="text-xl max-sm:text-lg font-bold">
          <Link className="text-primary" href="/">
            PrepFlow
          </Link>
        </NavigationMenuItem>
      </div>
    </>
  );
};

export default NavbarItems;
