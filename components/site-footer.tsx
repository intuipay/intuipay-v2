import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-mediumgray/50 bg-background">
      <div className="container py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p className="text-xs text-neutral-darkgray mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Intuipay Holding PTE. LTD. All rights reserved.
        </p>
        <div className="flex space-x-4">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              aria-label={social.name}
              className="text-neutral-darkgray hover:text-intuipay-blue transition-colors"
            >
              <social.icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
