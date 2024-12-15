import React, { useState, useCallback } from "react";
import { NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
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
import { NavigationMenuList } from "@radix-ui/react-navigation-menu";

const Navsheet: React.FC<{ pathname: string }> = ({ pathname }) => {
  const [open, setOpen] = useState(false)
  const onOpen = useCallback((open : boolean) => {
    setOpen(open)
  }, [])
  return (
    <Drawer open = {open} onOpenChange={onOpen}>
      <DrawerTrigger className="p-1 rounded-md border">
        <Menu />
      </DrawerTrigger>
      <DrawerContent>
        <NavigationMenuList>
          <DrawerHeader className="flex flex-col gap-8 font-medium">
            <DrawerTitle>
              <NavigationMenuItem className="text-xl font-bold">
                <Link onClick={() => setOpen(false)} className={isActive("/", pathname)} href="/">
                  PrepFlow
                </Link>
              </NavigationMenuItem>
            </DrawerTitle>
            <DrawerDescription className="flex text-base flex-col gap-6 pb-2">
            {navItems.map(({ href, label }) => (
            <NavigationMenuItem key={href}>
              <Link href={href} legacyBehavior passHref>
                <NavigationMenuLink onClick={() => setOpen(false)} className={isActive(href, pathname)}>
                  {label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
            </DrawerDescription>
          </DrawerHeader>
        </NavigationMenuList>
      </DrawerContent>
    </Drawer>
  );
};

export default Navsheet;
