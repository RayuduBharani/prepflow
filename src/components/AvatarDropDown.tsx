import React from "react";
import type { Session } from "next-auth";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { getTwoAlphabets } from "@/lib/utils";
import { LogOutIcon, LogIn } from "lucide-react";
import Link from "next/link";
import Form from "next/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/auth";
import { revalidatePath } from "next/cache";

const AvatarDropDown: React.FC<{ session: Session | null }> = ({ session }) => {
  return session?.user ? (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
              <AvatarImage
                src={session.user.image as string}
                alt={session.user.name as string}
              />
              <AvatarFallback>
                {getTwoAlphabets(session.user.name as string)}
              </AvatarFallback>
            <span className="sr-only">My Account</span>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
          <DropdownMenuItem>
            <Form
              className="w-full"
              action={async () => {
                "use server";
                await signOut();
                revalidatePath("/");
              }}
            >
              <Button
                type="submit"
                className="text-xs w-full"
                iconPlacement="right"
                icon={LogOutIcon}
                variant={"ghost"}
                size={"sm"}
              >
                Logout
              </Button>
            </Form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : (
    <Button
      asChild
      effect={"expandIcon"}
      iconPlacement="right"
      icon={LogIn}
      size={"sm"}
      className="text-xs"
    >
      <Link href={"/signin"}>Sign in</Link>
    </Button>
  );
};

export default AvatarDropDown;
