import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="bg-brand-blue rounded-tl-[64px] rounded-tr-[64px] w-screen ms-rest">
      <div className="xl:max-w-6xl 2xl:max-w-8xl mx-auto px-8 py-16 md:px-12 md:py-28 lg:px-16 lg:py-28 xl:p-28 flex flex-col justify-start items-center gap-8 md:gap-16">
        <div className="flex flex-col justify-start items-center gap-6">
          <div className="text-black text-6xl font-medium font-neue-montreal capitalize text-center">Simplify Education Giving</div>
          <div className="text-black/50 text-xl font-normal">
            Powered by stables, Intuipay's product suite transforms how education gets funded
          </div>
        </div>
        <Link className="bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-[40px] text-xl font-semibold leading-normal" href="mailto:support@intuipay.xyz">Book a demo</Link>
      </div>
    </section>
  );
}
