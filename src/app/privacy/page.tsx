// src/app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            <em>Last updated: November 29, 2025</em>
          </p>
          
          <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer service. This may include your name, email address, shipping address, payment information, and other details.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Process and fulfill your orders</li>
            <li>Provide customer support</li>
            <li>Send you promotional emails (with your consent)</li>
            <li>Improve our services and website</li>
            <li>Prevent fraud and enhance security</li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4">Information Sharing</h2>
          <p className="mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting business, or serving our users, so long as those parties agree to maintain the confidentiality of your information.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
          <p>
            You may access, update, or delete your personal information at any time by logging into your account or contacting us directly. You also have the right to request a copy of the personal data we hold about you.
          </p>
        </div>
      </div>
    </div>
  );
}