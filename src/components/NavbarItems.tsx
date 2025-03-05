"use client";
import React from "react";
import { NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { Session } from "next-auth";
import { navItems, isActive } from "@/lib/utils";

const NavbarItems: React.FC<{ session: Session | null }> = ({ session }) => {
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
          <Link tabIndex={0} href={href} legacyBehavior passHref>
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
        <NavigationMenuItem>
          <Link href={"/dashboard"} tabIndex={0} legacyBehavior passHref>
            <NavigationMenuLink
              onClick={(e) => handleClick(e, "/dashboard")}
              className={isActive("/dashboard", pathname)}
            >
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      )}
    </>
  );
};

export default NavbarItems;
