import {PropsWithChildren, ReactNode} from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our mission, vision, and team at Intuipay.',
};

export default function AboutLayout({
  children,
  sidebar,
}: PropsWithChildren & {
  sidebar: ReactNode;
}) {
  return (
    <div className="flex-1 flex">
      <div className="w-70 px-5 py-8 border-r flex flex-col">
        {sidebar}
      </div>
      <div className="flex-1 py-8 px-20">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
