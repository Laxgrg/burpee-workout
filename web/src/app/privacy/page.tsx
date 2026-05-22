import type { Metadata } from "next";
import { Box, Container, Divider, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Privacy Policy | BurpeePacers",
  description: "Privacy policy for BurpeePacers web and iOS app.",
};

const LAST_UPDATED = "May 22, 2026";
const CONTACT_EMAIL = "kpaccess@gmail.com";

export default function PrivacyPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={800} color="primary" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Last updated: {LAST_UPDATED}
        </Typography>

        <Section title="Overview">
          BurpeePacers (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
          operates the BurpeePacers website at burpeepacers.com and the
          BurpeePacers iOS app. This policy explains what information we
          collect, how we use it, and your rights regarding that information. We
          do not sell your personal data.
        </Section>

        <Section title="Information We Collect">
          <BulletList
            items={[
              "Email address — collected when you create an account or sign in with Google, used solely to identify your account.",
              "Workout logs — dates, rep counts, levels, and workout modes you record in the app.",
              "Body weight — optionally entered for protein target calculations. Stored only on your account.",
              "Progress photos — optionally uploaded as Day 1 baseline or 6-month check-in photos. Stored in your private Firebase Storage bucket.",
              "Start date — the date you began the program, used to calculate your program day and milestone dates.",
            ]}
          />
        </Section>

        <Section title="How We Use Your Information">
          <BulletList
            items={[
              "To provide and sync your workout history across the web app and iOS app.",
              "To calculate your current level, program day, and progress statistics.",
              "To send a one-time welcome email when you create a new account.",
              "To manage your subscription status if you subscribe to BurpeePacers Pro.",
            ]}
          />
          We do not use your data for advertising, profiling, or any purpose
          beyond operating the app.
        </Section>

        <Section title="Third-Party Services">
          We use the following third-party services which may process your data
          under their own privacy policies:
          <BulletList
            items={[
              "Firebase (Google) — authentication, database (Firestore), and file storage. Privacy policy: firebase.google.com/support/privacy",
              "Google Sign-In — optional sign-in method. Privacy policy: policies.google.com/privacy",
              "Stripe — payment processing for Pro subscriptions. We never see or store your full card number. Privacy policy: stripe.com/privacy",
              "Resend — transactional email delivery (welcome email only). Privacy policy: resend.com/legal/privacy-policy",
            ]}
          />
        </Section>

        <Section title="Data Retention">
          Your data is retained for as long as your account is active. If you
          delete your account or request deletion, we will permanently remove
          your personal data and workout history from our systems within 30
          days.
        </Section>

        <Section title="Your Rights">
          You have the right to:
          <BulletList
            items={[
              "Access the data we hold about you.",
              "Request correction of inaccurate data.",
              "Request deletion of your account and all associated data.",
              "Export your workout data (available in the app as a CSV download for Pro users).",
            ]}
          />
          To exercise any of these rights, email us at{" "}
          <Typography component="span" color="primary.main">
            {CONTACT_EMAIL}
          </Typography>
          .
        </Section>

        <Section title="Children's Privacy">
          BurpeePacers is not directed at children under 13. We do not knowingly
          collect personal information from children under 13. If you believe a
          child has provided us with personal information, please contact us and
          we will delete it promptly.
        </Section>

        <Section title="Security">
          All data is transmitted over HTTPS and stored in Firebase, which
          provides industry-standard encryption at rest and in transit. Access
          to your data is protected by Firebase Security Rules — only you can
          read or write your own workout data.
        </Section>

        <Section title="Changes to This Policy">
          We may update this policy from time to time. We will post the updated
          policy on this page with a revised &quot;Last updated&quot; date.
          Continued use of the app after changes constitutes acceptance of the
          updated policy.
        </Section>

        <Section title="Contact">
          If you have any questions about this privacy policy or how we handle
          your data, please contact us at{" "}
          <Typography component="span" color="primary.main">
            {CONTACT_EMAIL}
          </Typography>
          .
        </Section>
      </Container>
    </Box>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box mb={4}>
      <Typography variant="h5" fontWeight={700} mb={1.5}>
        {title}
      </Typography>
      <Typography
        component="div"
        variant="body1"
        color="text.secondary"
        sx={{ lineHeight: 1.8 }}
      >
        {children}
      </Typography>
      <Divider sx={{ mt: 3, borderColor: "rgba(255,255,255,0.08)" }} />
    </Box>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 8 }}>
      {items.map((item) => (
        <li
          key={item}
          style={{ marginBottom: 6, lineHeight: 1.7, color: "inherit" }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
