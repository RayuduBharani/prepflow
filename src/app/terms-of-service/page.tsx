import React from "react";


import type { Metadata } from "next";
import { metadata as defaultMetadata } from "@/lib/defaultMetadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Terms of Service | PrepFlow",
  description:
    "Review PrepFlow's Terms of Service to understand your rights, responsibilities, and the rules governing the use of our platform.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Terms of Service | PrepFlow",
    description:
      "Learn about PrepFlow's Terms of Service, including user responsibilities, intellectual property, and limitation of liability.",
    url: "https://yourdomain.com/terms-of-service",
  },
  alternates: {
    canonical: "https://yourdomain.com/terms-of-service",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServices() {
  return (
    <div className="pt-20 max-w-3xl mx-auto px-6">
      <h1 className="text-xl font-bold text-center mb-4">Terms of Service</h1>
      <p className="text-muted-foreground text-center mb-8">
        Last Updated: March 2025
      </p>

      <div className="space-y-6">
        <div>
          <h2 className="text-md font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground text-sm">
            By using PrepFlow, you agree to follow these Terms of Service. If
            you do not agree, please do not use our platform.
          </p>
        </div>

        <div>
          <h2 className="text-md font-semibold">2. User Responsibilities</h2>
          <p className="text-muted-foreground text-sm">
            Users must ensure that the content they share does not violate any
            laws. Misuse of the platform may result in account suspension.
          </p>
        </div>

        <div>
          <h2 className="text-md font-semibold">3. Intellectual Property</h2>
          <p className="text-muted-foreground text-sm">
            All content and resources provided on PrepFlow are the property of
            the platform. Unauthorized use or distribution is prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-md font-semibold">4. Limitation of Liability</h2>
          <p className="text-muted-foreground text-sm">
            We do not guarantee that the platform will always function
            flawlessly. We are not responsible for any loss or damages arising
            from its use.
          </p>
        </div>

        <div>
          <h2 className="text-md font-semibold">5. Changes to Terms</h2>
          <p className="text-muted-foreground text-sm">
            We may update these terms from time to time. Continued use of
            PrepFlow after changes means you accept the updated terms.
          </p>
        </div>
      </div>

      <p className="text-center text-muted-foreground mt-8">
        If you have any questions, contact us at{" "} {" "}
        <a href="mailto:rayudubharani7288@gmail.com" className="text-blue-600 underline">
          rayudubharani7288@gmail.com
        </a>
        <br />
        <a href="mailto:ashok7075657409@gmail.com" className="text-blue-600 underline">
          ashok7075657409@gmail.com
        </a>
      </p>
    </div>
  );
}
