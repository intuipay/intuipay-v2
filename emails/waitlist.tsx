import { Body, Html, Tailwind } from "@react-email/components";
import * as React from "react";

type Props = {
  id: number;
  email: string;
}

export default function Email({
  id,
  email,
}: Props) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            spacing: {
              15: "3.75rem",
            },
          },
        }
      }}
    >
    <Html className="h-full">
      <Body
        className="bg-gray-50 flex flex-col items-center justify-center h-full"
      >
        <div
          className="mx-w-md mx-auto py-7 px-10 bg-white"
          style={{ maxWidth: '450px' }}
        >
          <img
            src="https://intuipay.xyz/images/intuipay-logo.svg"
            width={142}
            height={28}
            className="h-7 block mx-auto mb-15"
            alt="Intuipay Logo"
          />
          <div className="text-2xl font-medium mt-0 mb-6">Welcome. 👋 You've joined the waitlist!</div>
          <div className="text-xs mb-6">Congratulations! You are #{id} on the Waitlist. Share your unique referral link to let your friends know how exciting Intuipay is:</div>
          <div className="mb-6">
            <a
              href={'https://intuipay.xyz/?ref_id=' + email}
              className="text-blue-600 underline hover:no-underline block"
              target="_blank"
            >https://intuipay.xyz/?ref_id={email}</a>
          </div>
          <div className="text-xs mb-2">Follow us on X: </div>
          <div className="mb-6">
            <a
              href="https://x.com/intuipay"
              className="text-blue-600 underline hover:no-underline block"
              target="_blank"
            >https://x.com/intuipay</a>
          </div>
        </div>
        <div className="mt-10 text-sm font-medium text-gray-500">
          &copy; {new Date().getFullYear()} Intuipay Holding PTE. LTD. All Rights Reserved.
        </div>
      </Body>
    </Html>
    </Tailwind>
  );
}
