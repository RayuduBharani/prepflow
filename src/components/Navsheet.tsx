"use client";
import React, { useState } from "react";
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
import { LayoutDashboard, Menu, X } from "lucide-react";
import { navItems, isActive } from "@/lib/utils";
import { Session } from "better-auth";
import { Button } from "./ui/button";
import { UserRole } from "../../generated/prisma/enums";
import { cn } from "@/lib/utils";

interface FullSession extends Session {
  role: UserRole;
}

const Navsheet: React.FC<{ session: FullSession | null }> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const [open, setOpen] = useState(false);

  const getBasePath = (href: string) => {
    if (pathSegments[0] === href.replace("/", "")) {
      return `/${pathSegments.slice(0, 1).join("/")}`;
    }
    return href;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const newPath = getBasePath(href);
    setOpen(false); // close drawer on navigation
    if (pathname !== newPath) router.push(newPath);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Open navigation menu"
          className="rounded-lg hover:bg-accent transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="px-0 pb-safe">
        <DrawerHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <DrawerTitle asChild>
            <Link
              href="/"
              onClick={(e) => handleClick(e, "/")}
              className="text-2xl font-extrabold tracking-tight text-foreground hover:text-primary transition-colors w-fit"
            >
              PrepFlow
            </Link>
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Mobile navigation menu
          </DrawerDescription>
        </DrawerHeader>

        <NavigationMenuList className="flex flex-col items-stretch gap-1 p-4">
          {navItems.map(({ href, label }) => (
            <NavigationMenuItem key={href} className="w-full">
              <NavigationMenuLink asChild>
                {/* BUG FIX: Link is now correctly inside NavigationMenuLink */}
                <Link
                  tabIndex={0}
                  href={href}
                  onClick={(e) => handleClick(e, href)}
                  className={cn(
                    "flex items-center w-full px-4 py-3 rounded-lg text-base font-medium",
                    "transition-all duration-150 outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:ring-2 focus-visible:ring-ring",
                    isActive(href, pathname)
                  )}
                >
                  {label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          {session?.role === "ADMIN" && (
            <>
              <div className="h-px bg-border/60 my-2 mx-4" aria-hidden />
              <NavigationMenuItem className="w-full">
                <NavigationMenuLink asChild>
                  <Link
                    tabIndex={0}
                    href="/dashboard"
                    onClick={(e) => handleClick(e, "/dashboard")}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-4 py-3 rounded-lg text-base font-medium",
                      "transition-all duration-150 outline-none",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:ring-2 focus-visible:ring-ring",
                      isActive("/dashboard", pathname)
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </DrawerContent>
    </Drawer>
  );
};

export default Navsheet;