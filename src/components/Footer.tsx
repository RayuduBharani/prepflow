import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/icons/Logo";
import { navItems } from "@/lib/utils";
import LinkedIn from "./icons/LinkedIn";
import Github from "./icons/Github";
import { Mail } from "lucide-react";
import Instagram from "./icons/Instagram";

const Footer: React.FC = () => (
  <footer className="w-full mt-20 border-t px-3 sm:px-6 py-16 bg-background text-foreground">
    <div className="container mx-auto max-w-7xl flex flex-wrap justify-between gap-8">
      <section className="max-w-xs">
        <h2 className="text-2xl flex items-center gap-2 font-bold">
          <Logo size={32} /> PrepFlow
        </h2>
        <p className="text-muted-foreground text-xs mb-8 mt-2">
          Streamline your DSA prep with structured sheets and company-wise
          problems.
        </p>
        <Link
          href="https://www.buymeacoffee.com/ashok70756x"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            alt="Buy Me a Coffee"
            width={180}
            height={50}
            src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=%E2%98%95&slug=ashok70756x&button_colour=FFDD00&font_colour=000000"
          />
        </Link>
      </section>
      <nav>
        <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
        <ul className="space-y-2">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-xs font-medium hover:text-primary transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Developed and Maintained By</h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-between flex-wrap items-center rounded-xl">
            <h3 className="text-sm font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Rayudu Bharani
            </h3>
            <div className="flex gap-2">
              <Link
                href={"https://linkedin.com/in/rayudu-bharani"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className={`transition-all hover:bg-[#0077B5] hover:text-white`}
                >
                  <LinkedIn />
                </Button>
              </Link>
              <Link
                href={"https://github.com/RayuduBharani"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className={`transition-all hover:bg-foreground hover:text-background`}
                >
                  <Github />
                </Button>
              </Link>
              <Link
                href={"mailto:rayudubharani7288@gmail.com"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className={`transition-all`}
                >
                  <Mail />
                </Button>
              </Link>
              <Link
                href={"https://instagram.com/bharani_rayudu"}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className={`transition-all hover:bg-gradient-to-r hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600`}
                >
                  <Instagram />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-between flex-wrap items-center rounded-xl">
            <h3 className="text-sm font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Cygnuxxs
            </h3>
            <div className="flex gap-2">
              <Link
                href={"https://linkedin.com/in/cygnuxxs"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className={`transition-all hover:bg-[#0077B5] hover:text-white`}
                >
                  <LinkedIn />
                </Button>
              </Link>
              <Link
                href={"https://github.com/cygnuxxs"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className={`transition-all hover:bg-foreground hover:text-background`}
                >
                  <Github />
                </Button>
              </Link>
              <Link
                href={"mailto:ashok7075657409@gmail.com"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className={`transition-all`}
                >
                  <Mail />
                </Button>
              </Link>
              <Link
                href={"https://instagram.com/cygnuxxs"}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className={`transition-all hover:bg-gradient-to-r hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600`}
                >
                  <Instagram />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    <p className="mt-12 text-center text-xs text-muted-foreground">
      &copy; {new Date().getFullYear()} PrepFlow. All rights reserved.
    </p>
    <p className="mt-2 text-center text-xs text-muted-foreground">
      <Link href={"/privacy-policy"} className="hover:text-primary/60">
        Privacy Policy
      </Link>{" "}
      |{" "}
      <Link href={"/terms-of-service"} className="hover:text-primary/60">
        Terms of Service
      </Link>
    </p>
  </footer>
);

export default memo(Footer);
