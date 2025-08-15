import Link from 'next/link'
import Image from 'next/image'

export function IntuipayLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2" aria-label="Intuipay Home">
      <Image
        src="/images/intuipay-logo.png"
        alt="intuipay-logo"
        width={121}
        height={24}
      />
      <h1 className="sr-only">Intuipay</h1>
    </Link>
  )
}
