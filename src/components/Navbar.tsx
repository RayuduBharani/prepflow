import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavbarItems from "./NavbarItems";
import AvatarDropDown from "./AvatarDropDown";
import { ModeToggle } from "./ui/ModeToggler";
import Navsheet from "./Navsheet";
import Link from "next/link";
import ThemeChanger from "./theme-color-toggler";
import { QuickSearch } from "./QuickSearch";
import { getSession } from "@/auth-client";

const Navbar = async () => {
  const session = await getSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Blur + border backdrop */}
      <div className="relative mx-auto max-w-screen-2xl">
        <NavigationMenu
          className={[
            "w-full px-4 md:px-6 py-3",
            "bg-background/70 backdrop-blur-xl backdrop-saturate-150",
            "border-b border-border/50",
            "shadow-sm shadow-black/5",
            "flex items-center gap-4",
          ].join(" ")}
        >
          {/* ── Mobile: hamburger + brand ── */}
          <div className="md:hidden flex items-center gap-3">
            <Navsheet session={session} />
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight text-foreground hover:text-primary transition-colors duration-200"
            >
              PrepFlow
            </Link>
          </div>

          {/* ── Desktop: full nav ── */}
          <NavigationMenuList className="hidden md:flex items-center gap-1">
            <NavbarItems session={session} />
          </NavigationMenuList>

          {/* ── Right actions ── */}
          <div className="ml-auto flex items-center gap-1.5">
            <QuickSearch />
            <ThemeChanger />
            <ModeToggle />
            <div className="h-5 w-px bg-border mx-1 hidden sm:block" aria-hidden />
            <AvatarDropDown session={session} />
          </div>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;