import { Activity } from "lucide-react"
import Link from "next/link"

export function IntuipayLogo() {
  return (
    <Link href="/projects" className="flex items-center space-x-2" aria-label="Intuipay Home">
      <Activity className="h-7 w-7 md:h-8 md:w-8 text-intuipay-blue" />
      <span className="font-bold text-xl md:text-2xl text-neutral-text">Intuipay</span>
    </Link>
  )
}
