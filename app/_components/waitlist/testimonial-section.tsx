export default function TestimonialSection() {
  return (
    <section className="px-8 py-12 md:px-12 md:py-20 lg:px-16 lg:py-28 xl:p-28 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-start">
        <div className="flex-1 text-black text-6xl font-medium font-['Neue_Montreal'] capitalize leading-normal">
          Testimonial
        </div>
        <div className="flex-1 flex flex-col gap-12 lg:gap-24 items-start justify-center">
          {/* First Testimonial */}
          <div className="flex flex-col gap-4 lg:gap-8 w-full">
            <div className="text-black/70 text-sm lg:text-base font-normal leading-normal w-full">
              "Intuipay has been great. The website is easy to navigate and almost everything is automated. Whenever we have a question, the team is always quick to get back to us. We can incorporate Intuipay's features into our website and customize it to our brand standards."
            </div>
            <div className="text-black/70 text-lg lg:text-xl font-semibold leading-normal w-full">
              Name / logo
            </div>
          </div>

          {/* Second Testimonial */}
          <div className="flex flex-col gap-4 lg:gap-8 w-full">
            <div className="text-black/70 text-sm lg:text-base font-normal leading-normal w-full">
              "Intuipay has been great. The website is easy to navigate and almost everything is automated. Whenever we have a question, the team is always quick to get back to us. We can incorporate Engiven's features into our website and customize it to our brand standards."
            </div>
            <div className="text-black/70 text-lg lg:text-xl font-semibold leading-normal w-full">
              Name / logo
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
