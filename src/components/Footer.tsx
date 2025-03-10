import React, { memo } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Logo from "./icons/Logo";
import { navItems } from "@/lib/utils";
import { cygSocialLinks, rbSocialLinks } from "@/lib/footer-social-links";
import Image from "next/image";

// Constants for footer data
const FOOTER_DATA = {
  description:
    "Streamline your DSA prep with structured sheets and company-wise problems.",
  copyright: "PrepFlow. All rights reserved.",
  version: "v1.0.0",
};

// Memoized Social Button Component
const SocialButton = memo(
  ({
    href,
    label,
    icon,
    hoverClass,
    isGradient,
  }: {
    href: string;
    label: string;
    icon: React.JSX.Element;
    hoverClass: string;
    isGradient?: boolean;
  }) => (
    <Link
      href={href}
      target="_blank"
      aria-label={label}
      rel="noopener noreferrer"
    >
      <div className={isGradient ? "group" : ""}>
        <Button
          size="icon"
          variant="outline"
          className={`relative overflow-hidden transition-all duration-300 ease-in-out bg-transparent dark:text-white text-foreground ${hoverClass}`}
        >
          {icon}
        </Button>
      </div>
    </Link>
  )
);
SocialButton.displayName = "SocialButton";

// Memoized Developer Section Component
const DeveloperSection = memo(
  ({
    name,
    socialLinks,
  }: {
    name: string;
    socialLinks: typeof cygSocialLinks;
  }) => (
    <div className="flex gap-4 flex-wrap items-center rounded-xl">
      <h3 className="text-sm font-bold mr-auto bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 text-transparent">
        {name}
      </h3>
      <div className="flex gap-2">
        {socialLinks.map((link, index) => (
          <SocialButton key={index} {...link} />
        ))}
      </div>
    </div>
  )
);
DeveloperSection.displayName = "DeveloperSection";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t max-sm:px-3 px-6 py-16 bg-background text-foreground">
      <div className="container mx-auto flex flex-wrap justify-between gap-8">
        {/* Brand & Description */}
        <section className="max-w-xs">
          <h2 className="text-2xl flex items-center gap-2 font-bold">
            <Logo size={32} />
            PrepFlow
          </h2>
          <p className="text-xs mb-8 mt-2">{FOOTER_DATA.description}</p>
          <Link
            href="https://www.buymeacoffee.com/ashok70756x"
            className="relative inline-block min-w-[180px] min-h-[50px]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              alt="Buy Me a Coffee"
              fill
              sizes="180px"
              unoptimized
              style={{ objectFit: "contain" }}
              src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=%E2%98%95&slug=ashok70756x&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
            />
          </Link>
        </section>

        {/* Quick Links */}
        <nav aria-label="Quick Links">
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs font-medium hover:text-primary transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Links */}
        <section aria-label="Social Media" className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Developed and Maintained By</h2>
          <div className="flex my-2 flex-col gap-3">
            <DeveloperSection name="Cygnuxxs" socialLinks={cygSocialLinks} />
            <DeveloperSection
              name="Rayudu Bharani"
              socialLinks={rbSocialLinks}
            />
          </div>
        </section>
      </div>

      {/* Enhanced Copyright Section */}
      <p className="mt-12 text-center text-xs text-muted-foreground">
        &copy; {currentYear} {FOOTER_DATA.copyright}
      </p>
    </footer>
  );
};

export default memo(Footer);
