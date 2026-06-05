import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#111111] text-white px-4 sm:px-6 lg:px-16 py-16 font-montserrat">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bric font-semibold">
          Shop Pal <span className="text-orange-500">Terms & Privacy</span>
        </h1>
        <p className="text-white/50 mt-2 text-sm sm:text-base">
          Effective Date: June 2026
        </p>
      </div>

      {/* INTRO CARD */}
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-md">
        <p className="text-white/70 leading-relaxed text-sm sm:text-base">
          Welcome to Shop Pal. Shop Pal is an online marketplace that allows
          customers to discover products and allows vendors and business owners
          to create and manage their own online stores.
          <br /><br />
          By accessing or using Shop Pal, you agree to be bound by these Terms.
          If you do not agree, you should not use the platform.
        </p>
      </div>

      {/* SECTIONS */}
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Section 1 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-orange-500/40 transition">
          <h2 className="text-lg sm:text-xl font-semibold text-orange-500 mb-2">
            1. Acceptance of Terms
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            By creating an account, opening a store, listing products, or using
            Shop Pal, you acknowledge that you have read and agreed to these Terms.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-orange-500/40 transition">
          <h2 className="text-lg sm:text-xl font-semibold text-orange-500 mb-2">
            2. About Shop Pal
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Shop Pal is a marketplace where vendors can create stores and sell
            products, while customers can browse and purchase items. We provide
            the technology and infrastructure that connects buyers and sellers.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-orange-500/40 transition">
          <h2 className="text-lg sm:text-xl font-semibold text-orange-500 mb-2">
            3. Marketplace Role
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Shop Pal acts as an intermediary platform. Vendors are responsible
            for their products, pricing, and fulfillment. We reserve the right
            to suspend or remove accounts or listings at any time.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-orange-500/40 transition">
          <h2 className="text-lg sm:text-xl font-semibold text-orange-500 mb-2">
            4. User Accounts
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Users must provide accurate information when registering. You are
            responsible for maintaining the security of your account.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-orange-500/40 transition">
          <h2 className="text-lg sm:text-xl font-semibold text-orange-500 mb-2">
            5. Privacy Policy
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            We collect basic user data such as name, email, and activity to
            improve user experience. We do not sell personal data to third parties.
          </p>
        </div>

        {/* Section 6 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-orange-500/40 transition">
          <h2 className="text-lg sm:text-xl font-semibold text-orange-500 mb-2">
            6. Termination
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Shop Pal reserves the right to suspend or terminate accounts that
            violate our policies or engage in harmful activity.
          </p>
        </div>

      </div>

      {/* FOOTER NOTE */}
      <div className="max-w-4xl mx-auto text-center mt-12 text-white/40 text-xs sm:text-sm">
        © 2026 Shop Pal. All rights reserved.
      </div>
    </div>
  );
}