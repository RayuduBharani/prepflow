'use client'
import React from "react";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { navItems, isActive } from "@/lib/utils";
import type { Session } from "next-auth";
import { Button } from "./ui/button";

const Navsheet: React.FC<{session: Session | null }> = ({
  session,
}) => {
  const router = useRouter();
  const pathname = usePathname()
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
    <Drawer>
      <DrawerTrigger asChild aria-label="Open Navigation Drawer" className="rounded-md border">
        <Button size={'icon'} variant={'ghost'}>
        <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <NavigationMenuList className="flex flex-col pb-8 justify-center gap-6">
          <DrawerHeader className="font-medium">
            <DrawerTitle>
              <NavigationMenuItem tabIndex={0} className="text-xl font-bold">
                <Link
                  onClick={(e) => handleClick(e, "/")}
                  className={isActive("/", pathname)}
                  href="/"
                >
                  PrepFlow
                </Link>
              </NavigationMenuItem>
            </DrawerTitle>
            <DrawerDescription className="hidden">Navigation for Mobile</DrawerDescription>
          </DrawerHeader>
          <>
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
              {/* Dashboard Link for Admin LOGIN */}
              {session && session.user.role === "ADMIN" && (
                <NavigationMenuItem >
                  <Link tabIndex={0} href={"/dashboard"} legacyBehavior passHref>
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
        </NavigationMenuList>
      </DrawerContent>
    </Drawer>
  );
};

export default Navsheet;
