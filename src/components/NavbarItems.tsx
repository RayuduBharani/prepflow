"use client";
import React from "react";
import { NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Session } from "better-auth";
import { navItems, isActive } from "@/lib/utils";
import { UserRole } from "../../generated/prisma/enums";

interface FullSession extends Session {
  role : UserRole
}

const NavbarItems: React.FC<{ session: FullSession | null }> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean); // Remove empty segments

  // Dynamically determine the base path
  const getBasePath = (href: string) => {
    if (pathSegments[0] === href.replace("/", "")) {
      return `/${pathSegments.slice(0, 1).join("/")}`; // Keep first 2 segments
    }
    return href; // Default to normal href
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const newPath = getBasePath(href);
    if (pathname !== newPath) {
      router.push(newPath);
    }
  };

  return (
    <>
      <NavigationMenuItem
        className="text-xl max-sm:text-lg font-bold"
      >
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
            <NavigationMenuLink asChild
              onClick={(e) => handleClick(e, href)}
              className={isActive(href, pathname)}
            >
          <Link tabIndex={0} href={href}>
              {label}
          </Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
      {session?.role === "ADMIN" && (
        <NavigationMenuItem>
            <NavigationMenuLink asChild
              onClick={(e) => handleClick(e, "/dashboard")}
              className={isActive("/dashboard", pathname)}
            >
          <Link href={"/dashboard"} tabIndex={0}>
              Dashboard
          </Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
      )}
    </>
  );
};

export default NavbarItems;
