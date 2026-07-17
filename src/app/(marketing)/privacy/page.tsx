"use client"

import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">Last updated: July 2026</p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly, including your name, email address, phone number,
                and profile information. We also collect data about how you use our platform.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information is used to provide and improve our services, process transactions,
                send notifications, and personalize your experience on InzuLink.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data, including
                encryption at rest and in transit, regular security audits, and access controls.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, correct, or delete your personal data at any time.
                You can manage your privacy settings from your account dashboard.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related inquiries, please contact us at privacy@inzulink.rw.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
