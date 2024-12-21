import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ui/ModeToggler";
import { Button } from "./ui/button";
import Link from "next/link";
import { LogIn, LogOutIcon } from "lucide-react";
import NavbarItems from "./NavbarItems";
import { auth, signOut } from "@/auth";
import { getTwoAlphabets } from "@/lib/utils";
import Form from "next/form";

const Navbar = async () => {
  const session = await auth();

  return (
    <NavigationMenu className="py-4 fixed">
      <NavigationMenuList className="w-screen justify-between px-12 max-md:px-2 gap-2 text-sm font-medium">
        <NavbarItems />
        <div className="flex items-center gap-2">
          <ModeToggle />
          {session?.user ? (
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage
                  src={session.user.image as string}
                  alt={session.user.name as string}
                />
                <AvatarFallback>
                  {getTwoAlphabets(session.user.name as string)}
                </AvatarFallback>
              </Avatar>
              <Form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button
                type="submit"
                  className="text-xs"
                  effect={"expandIcon"}
                  iconPlacement="right"
                  icon={LogOutIcon}
                  variant={"destructive"}
                  size={"sm"}
                >Logout</Button>
              </Form>
            </div>
          ) : (
            <Button
              asChild
              effect={"expandIcon"}
              iconPlacement="right"
              icon={LogIn}
              size={'sm'}
              className="text-xs"
            >
              <Link href={"/signin"}>Sign in</Link>
            </Button>
          )}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
