import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function SupportHeroSection() {
  return (
    <section className="flex py-20 max-w-5xl mx-auto gap-19">
      <div className="flex-1 flex flex-col">
        <p className="text-6xl/relaxed">Hello,<br/>How can we help?</p>
        <div className="flex items-center bg-background-gray rounded-full px-4 h-14 mt-auto">
          <MagnifyingGlassIcon className="size-6 text-black/40" />
          <Input
            className="bg-transparent"
            placeholder="Search knowledge base"
            type="search"
          />
        </div>
      </div>
      <Image
        className="w-80 flex-none"
        src="/images/diamond.svg"
        alt="Stylized image of hands exchanging coins over a digital interface"
        priority
        width={320}
        height={292}
      />
    </section>
  );
}
