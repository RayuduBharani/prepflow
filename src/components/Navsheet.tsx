import React, { useState, useCallback } from "react";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { useRouter } from "next/navigation";
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

const Navsheet: React.FC<{ pathname: string; session: Session | null }> = ({
  pathname,
  session,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const onOpen = useCallback((open: boolean) => {
    setOpen(open);
  }, []);
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setOpen(!open);
    if (pathname !== href) {
      router.push(href);
    }
  };
  return (
    <Drawer open={open} onOpenChange={onOpen}>
      <DrawerTrigger className="p-1 rounded-md border">
        <Menu />
      </DrawerTrigger>
      <DrawerContent>
        <NavigationMenuList>
          <DrawerHeader className="flex flex-col gap-8 font-medium">
            <DrawerTitle>
              <NavigationMenuItem className="text-xl font-bold">
                <Link
                  onClick={(e) => handleClick(e, "/")}
                  className={isActive("/", pathname)}
                  href="/"
                >
                  PrepFlow
                </Link>
              </NavigationMenuItem>
            </DrawerTitle>
            <DrawerDescription className="flex text-base flex-col gap-6 pb-2">
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
              {/* Dashboard Link for Admin LOGIN */}
              {session && session.user.role === "ADMIN" && (
                <NavigationMenuItem>
                  <Link href={"/dashboard"} legacyBehavior passHref>
                    <NavigationMenuLink
                      onClick={(e) => handleClick(e, "/dashboar")}
                      className={isActive("/dashboard", pathname)}
                    >
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </DrawerDescription>
          </DrawerHeader>
        </NavigationMenuList>
      </DrawerContent>
    </Drawer>
  );
};

export default Navsheet;
