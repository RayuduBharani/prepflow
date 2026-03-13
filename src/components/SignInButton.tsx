"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const SignInButton = () => {
  const pathname = usePathname();
  const href =
    pathname && pathname !== "/signin"
      ? `/signin?callbackUrl=${encodeURIComponent(pathname)}`
      : "/signin";

  return (
    <Button
      asChild
      effect={"expandIcon"}
      iconPlacement="right"
      icon={LogIn}
      size={"sm"}
      className="text-xs"
    >
      <Link href={href}>Sign in</Link>
    </Button>
  );
};

export default SignInButton;
