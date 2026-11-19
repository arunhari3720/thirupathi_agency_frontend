
import React from "react";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function MasterAuthLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-[#F7F7F3] flex items-center justify-center p-4">

      <div className="w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-[30px] border border-white bg-white/70 shadow-2xl backdrop-blur-2xl">

        {/* LEFT SIDE */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#fff7c2] via-[#ffed83] to-[#FFE45C] p-12">

          <div className="relative z-10">
            <Link to="/" className="text-2xl font-extrabold text-gray-900">
              Thirupathi <span className="text-yellow-800">Agencies</span>
            </Link>

            <div className="mt-24">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70">
                <ShieldCheck size={35} />
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-gray-900">
                Master Control
                <br />
                Panel
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-gray-700">
                Manage your business, monitor users and control your
                platform from one secure dashboard.
              </p>
            </div>
          </div>

          <p className="relative z-10 text-xs font-medium text-gray-600">
            © 2026 Thirupathi Agencies. All rights reserved.
          </p>

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/40 blur-3xl" />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">

            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <ShieldCheck className="text-yellow-600" />
              <span className="font-extrabold">
                Thirupathi Agencies
              </span>
            </div>

            <div className="mb-8">
              <span className="rounded-full bg-[#FFF4B5] px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-900">
                Master Administration
              </span>

              <h2 className="mt-5 text-3xl font-extrabold text-gray-900">
                {title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Secure access to your administration account.
              </p>
            </div>

            {children}

          </div>
        </div>

      </div>
    </div>
  );
}
