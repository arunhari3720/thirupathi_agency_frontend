
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F4EE] p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl overflow-hidden rounded-[28px] bg-white shadow-xl lg:grid-cols-2">

        {/* Left Form */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <a href="/" className="mb-10 inline-block">
              <img
                src="https://res.cloudinary.com/gtqzljit/image/upload/v1790821022/pngwing.com.png"
                alt="Thirupathi Agency"
                className="h-12 w-auto object-contain"
              />
            </a>

            {children}
          </div>
        </div>

        {/* Right Image */}
              <div className="relative hidden h-screen w-full overflow-hidden lg:block">
              <img
            src="https://res.cloudinary.com/gtqzljit/image/upload/v1794586831/Thirupathi_Agencies_Product_Showcase.png"
            alt="Grocery products"
className="absolute inset-0 h-full w-full object-contain object-top pt-6"          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />

          <div className="absolute left-10 top-10 rounded-full border border-white/30 bg-white/20 px-5 py-3 text-xs font-semibold tracking-widest text-white backdrop-blur-lg">
            THIRUPATHI AGENCY
          </div>

          <div className="absolute bottom-0 p-12 text-white">
            <span className="rounded-full bg-[#D2E823] px-4 py-2 text-xs font-bold text-black">
              QUALITY · TRUST · RELIABILITY
            </span>

            <h2 className="mt-7 max-w-lg text-5xl font-extrabold leading-tight">
              Trusted brands.
              <br />
              Reliable supply.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/80">
              Your trusted distribution partner for groceries,
              food products and everyday essentials.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
