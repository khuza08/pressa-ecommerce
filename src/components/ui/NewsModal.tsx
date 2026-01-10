import { FiX } from 'react-icons/fi';

export default function NewsletterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#242424] bg-opacity-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/50 hover:text-black"
          aria-label="Close modal"
        >
          <FiX className="text-2xl" />
        </button>
        <div className="text-center mb-4">
          <img
            src="/assets/images/newsletter.png"
            alt="Subscribe"
            className="mx-auto w-32 h-32"
          />
        </div>
        <h3 className="text-xl font-bold text-center">Subscribe Newsletter.</h3>
        <p className="text-black/60 text-center mt-2">
          Subscribe the <b>Anon</b> to get latest products and discount updates.
        </p>
        <form className="mt-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full px-4 py-2 border border-black/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}