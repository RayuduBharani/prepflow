"use client";
import React from "react";
import { NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Session } from "better-auth";
import { navItems, isActive } from "@/lib/utils";
import { UserRole } from "../../generated/prisma/enums";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullSession extends Session {
  role: UserRole;
}

const NavbarItems: React.FC<{ session: FullSession | null }> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const getBasePath = (href: string) => {
    if (pathSegments[0] === href.replace("/", "")) {
      return `/${pathSegments.slice(0, 1).join("/")}`;
    }
    return href;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const newPath = getBasePath(href);
    if (pathname !== newPath) router.push(newPath);
  };

  return (
    <>
      {/* Brand */}
      <NavigationMenuItem>
        <Link
          href="/"
          onClick={(e) => handleClick(e, "/")}
          className="text-xl font-extrabold tracking-tight text-foreground hover:text-primary transition-colors duration-200 select-none"
        >
          PrepFlow
        </Link>
      </NavigationMenuItem>

      {/* Separator */}
      <div className="h-5 w-px bg-border mx-1" aria-hidden />

      {/* Nav links */}
      {navItems.map(({ href, label }) => (
        <NavigationMenuItem key={href}>
          <NavigationMenuLink asChild>
            <Link
              tabIndex={0}
              href={href}
              onClick={(e) => handleClick(e, href)}
              className={cn(
                "relative px-2 py-1.5 text-sm font-medium transition-colors duration-200 outline-none",
                "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 after:origin-left",
                "hover:text-primary hover:after:scale-x-100",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm",
                isActive(href, pathname)
              )}
            >
              {label}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}

      {/* Admin Dashboard */}
      {session?.role === "ADMIN" && (
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/dashboard"
              tabIndex={0}
              onClick={(e) => handleClick(e, "/dashboard")}
              className={cn(
                "relative flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md border border-border/60",
                "transition-all duration-200 outline-none",
                "hover:bg-accent hover:text-accent-foreground hover:border-primary/40",
                "focus-visible:ring-2 focus-visible:ring-ring",
                isActive("/dashboard", pathname)
              )}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      )}
    </>
  );
};

export default NavbarItems;