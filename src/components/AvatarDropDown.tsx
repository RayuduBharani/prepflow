import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { getTwoAlphabets, formatDate } from "@/lib/utils";
import { LogOutIcon, LogIn } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Form from "next/form";
import { signOut } from "@/auth-client";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma";
import { Session } from "better-auth";

const AvatarDropDown = async ({ session }: { session: Session | null }) => {
  if (!session?.userId)
    return (
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

  const user = await prisma.user.findUnique({
    where: { id: session?.userId },
    select: { name: true, lastLogin: true, email: true, role : true, image : true, },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar>
          <AvatarImage
            src={user?.image as string}
            alt={user?.name as string}
          />
          <AvatarFallback>
            {getTwoAlphabets(user?.name as string)}
          </AvatarFallback>
          <span className="sr-only">My Account</span>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-64 bg-background/10 backdrop-blur-sm border border-primary/30 rounded-xl p-0"
      >
        <div className="flex flex-col gap-2 p-4">
          <h1 className="text-base text-primary-foreground font-semibold">
            {user?.name}
          </h1>
          <p className="text-xs text-secondary-foreground truncate">
            {user?.email}
          </p>
          {user?.lastLogin && (
            <p className="text-xs text-muted-foreground">
              Last Login {formatDate(user.lastLogin)}
            </p>
          )}
          <Form
            action={async () => {
              "use server";
              await signOut();
              revalidatePath("/");
            }}
          >
            <Button
              type="submit"
              className="text-xs w-full rounded-b-xl"
              iconPlacement="right"
              icon={LogOutIcon}
              variant="ghost"
              size="sm"
              effect="expandIcon"
            >
              Logout
            </Button>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AvatarDropDown;
