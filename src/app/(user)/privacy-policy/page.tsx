import Link from "next/link";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="w-full min-h-svh flex flex-col gap-4 pt-[5rem] px-6 max-md:px-3">
      <p className="text-xs text-muted-foreground">Effective Date: 13/03/25</p>
      <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
      <ol className="list-decimal flex flex-col gap-16 text-muted-foreground font-bold mx-4 text-xl">
        <li className="flex text-xl gap-2 font-bold flex-col">
          Introduction{" "}
          <span className="text-sm font-normal">
            Welcome to PrepFlow. Your privacy is important to us, and we are
            committed to protecting the personal information you share with us.
            This Privacy Policy explains how we collect, use, and protect your
            data when you use our platform.
          </span>{" "}
        </li>
        <li className="flex text-xl gap-2 font-bold flex-col">
          Information We Collect{" "}
          <span className="text-sm font-normal">
            We may collect the following types of information:
            <ul className="list-disc pl-5">
              <li>Personal Information: Name, email address, and other details you provide when signing up.</li>
              <li>Usage Data: Information on how you interact with our platform, such as visited pages, time spent, and preferences.</li>
              <li>Device Information: IP address, browser type, and operating system.</li>
            </ul>
          </span>{" "}
        </li>
        <li className="flex text-xl gap-2 font-bold flex-col">
          How We Use Your Information{" "}
          <span className="text-sm font-normal">
            We use your information to:
            <ul className="list-disc pl-5">
              <li>Provide and improve our services.</li>
              <li>Personalize your experience.</li>
              <li>Communicate with you regarding updates, support, and promotional content.</li>
              <li>Ensure the security of our platform.</li>
            </ul>
          </span>{" "}
        </li>
        <li className="flex text-xl gap-2 font-bold flex-col">
          Data Sharing and Disclosure{" "}
          <span className="text-sm font-normal">
            We do not sell, trade, or rent your personal information. However, we may share data with:
            <ul className="list-disc pl-5">
              <li>Service Providers: Third-party vendors assisting in running our platform.</li>
              <li>Legal Requirements: If required by law or to protect our rights.</li>
            </ul>
          </span>{" "}
        </li>
        <li className="flex text-xl gap-2 font-bold flex-col">
          Data Security{" "}
          <span className="text-sm font-normal">
            We implement industry-standard security measures to protect your data. However, no method of tranbaseission over the internet is completely secure, and we cannot guarantee absolute security.
          </span>{" "}
        </li>
        <li className="flex text-xl gap-2 font-bold flex-col">
          Your Rights and Choices{" "}
          <span className="text-sm font-normal">
            You have the right to:
            <ul className="list-disc pl-5">
              <li>Access, update, or delete your personal data.</li>
              <li>Opt-out of marketing communications.</li>
              <li>Restrict or object to data processing under certain conditions.</li>
            </ul>
          </span>{" "}
        </li>
        <li className="flex text-xl gap-2 font-bold flex-col">
          Cookies and Tracking Technologies{" "}
          <span className="text-sm font-normal">
            We use cookies to enhance user experience, analyze traffic, and improve functionality. You can manage cookie preferences through your browser settings.
          </span>{" "}
        </li>
        <li className="flex text-xl gap-2 font-bold flex-col">
          Third-Party Links{" "}
          <span className="text-sm font-normal">
            Our platform may contain links to third-party sites. We are not responsible for their privacy policies or practices.
          </span>{" "}
        </li>
        <li className="flex text-xl gap-2 font-bold flex-col">
          Changes to This Privacy Policy{" "}
          <span className="text-sm font-normal">
            We may update this policy from time to time. Any changes will be posted on this page with an updated effective date.
          </span>{" "}
        </li>
        <li className="flex text-xl gap-2 font-bold flex-col">
          Contact Us{" "}
          <span className="text-sm font-normal">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <Link href="mailto:ashok7075657409@gmail.com" className="text-primary/60">ashok7075657409@gmail.com</Link>.
          </span>{" "}
        </li>
      </ol>
    </div>
  );
};

export default PrivacyPolicy;
