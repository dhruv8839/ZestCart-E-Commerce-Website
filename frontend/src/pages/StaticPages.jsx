import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';

/** Reusable static page shell */
function StaticPage({ title, description, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <SEO title={title} description={description} />
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-12">
        <Link
          to="/"
          className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-500 dark:text-brand-400"
        >
          ← Back to ZestCart
        </Link>
        <h1 className="mt-6 text-3xl font-black text-slate-900 dark:text-white">
          {title}
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}

export function HelpCenter() {
  return (
    <StaticPage title="Help Center" description="Get help with your ZestCart orders and account.">
      <p>Welcome to the ZestCart Help Center. We're here to make your shopping experience seamless.</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">How do I track my order?</p>
          <p>Once your order ships, you'll receive a tracking email with a link to monitor delivery status in real time.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">What payment methods do you accept?</p>
          <p>We accept all major credit cards, debit cards, UPI, and net banking. All transactions are secured with 256-bit encryption.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">How do I contact support?</p>
          <p>Email us at <span className="font-medium text-brand-600 dark:text-brand-400">support@zestcart.com</span> or use the <Link to="/contact" className="font-medium text-brand-600 hover:underline dark:text-brand-400">Contact Us</Link> page.</p>
        </div>
      </div>
    </StaticPage>
  );
}

export function ReturnsPolicy() {
  return (
    <StaticPage title="Returns Policy" description="Learn about ZestCart's return and refund process.">
      <p>We want you to love every purchase. If something isn't right, here's how returns work.</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">30-Day Return Window</h2>
      <p>All items can be returned within 30 days of delivery in their original condition and packaging. Simply initiate a return from your order history.</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Refund Process</h2>
      <p>Refunds are processed within 5–7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Non-Returnable Items</h2>
      <p>For hygiene reasons, beauty products, undergarments, and perishable goods cannot be returned once opened.</p>
    </StaticPage>
  );
}

export function PrivacyPolicy() {
  return (
    <StaticPage title="Privacy Policy" description="How ZestCart handles your personal data.">
      <p><strong>Effective Date:</strong> January 1, 2026</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Information We Collect</h2>
      <p>We collect information you provide directly — such as name, email, shipping address, and payment details — when you create an account or place an order.</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">How We Use Your Data</h2>
      <p>Your information is used to process orders, personalize your shopping experience, and send relevant updates. We never sell your personal data to third parties.</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data Security</h2>
      <p>All data is encrypted in transit and at rest. We use industry-standard security practices to protect your information.</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Rights</h2>
      <p>You can request access to, correction of, or deletion of your personal data at any time by contacting <span className="font-medium text-brand-600 dark:text-brand-400">privacy@zestcart.com</span>.</p>
    </StaticPage>
  );
}

export function TermsOfService() {
  return (
    <StaticPage title="Terms of Service" description="Terms and conditions for using ZestCart.">
      <p><strong>Effective Date:</strong> January 1, 2026</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Acceptance of Terms</h2>
      <p>By accessing or using ZestCart, you agree to be bound by these terms. If you do not agree, please discontinue use of our platform.</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">User Accounts</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Orders & Pricing</h2>
      <p>All prices are in USD and subject to change. We reserve the right to cancel orders in cases of pricing errors or suspected fraud.</p>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Limitation of Liability</h2>
      <p>ZestCart is provided "as-is." We make no warranties, express or implied, regarding the availability or accuracy of our services.</p>
    </StaticPage>
  );
}

export function ContactUs() {
  return (
    <StaticPage title="Contact Us" description="Get in touch with the ZestCart team.">
      <p>We'd love to hear from you. Reach out using any of the methods below.</p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email</p>
          <p className="mt-2 font-semibold text-brand-600 dark:text-brand-400">support@zestcart.com</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Phone</p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">+1 (800) 555-ZEST</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Business Hours</p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">Mon – Fri, 9 AM – 6 PM EST</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Address</p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">123 Commerce St, Suite 100<br />San Francisco, CA 94105</p>
        </div>
      </div>
    </StaticPage>
  );
}
