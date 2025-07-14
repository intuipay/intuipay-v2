export default function CtaSection() {
  return (
    <section className="bg-brand-blue rounded-tl-[64px] rounded-tr-[64px]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-[120px] flex flex-col justify-start items-center gap-12 md:gap-16">
        <div className="flex flex-col justify-start items-center gap-6">
          <div className="text-black text-[28px] md:text-[56px] font-medium font-['Neue_Montreal'] capitalize text-center">Simplify Education Giving</div>
          <div className="text-black/50 text-base md:text-[20px] font-normal text-center px-4">
            Powered by stables, Intuipay's product suite transforms how education gets funded
          </div>
        </div>
        <button className="bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-[40px] text-lg md:text-[20px] font-semibold leading-6">Book a demo</button>
      </div>
    </section>
  );
}
