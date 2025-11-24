// src/components/NewsletterModal.tsx
export default function NewsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
          <Ion-Icon name="close-outline"></IonIcon>
        </button>
        <div className="text-center mb-4">
          <img src="/assets/images/newsletter.png" alt="Subscribe" className="mx-auto w-32 h-32" />
        </div>
        <h3 className="text-xl font-bold text-center">Subscribe Newsletter.</h3>
        <p className="text-gray-600 text-center mt-2">
          Subscribe the <b>Anon</b> to get latest products and discount update.
        </p>
        <form className="mt-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}