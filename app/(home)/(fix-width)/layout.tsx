import {PropsWithChildren} from "react";
import {SiteFooter} from "@/components/site-footer";

export default function FixWidthLayout({
  children
}: PropsWithChildren) {
  return <>
    <main className="w-full container mx-auto flex-grow md:pt-20">
      {children}
    </main>
    <SiteFooter />
  </>;
}
