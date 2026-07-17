"use client"

import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last updated: July 2026</p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using InzuLink, you agree to be bound by these terms. If you do not agree,
                please do not use our services.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">2. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to provide accurate information, maintain the confidentiality of your account,
                and comply with all applicable laws when using our platform.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Listing Guidelines</h2>
              <p className="text-muted-foreground leading-relaxed">
                Landlords must ensure all property listings are accurate, truthful, and comply with
                Rwandan housing regulations. Misleading listings will be removed.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Payments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rent payments processed through InzuLink are secured and held in escrow until
                the tenant confirms occupancy.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                InzuLink acts as a marketplace connecting landlords and tenants. We are not responsible
                for disputes between users but will assist in resolution.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
