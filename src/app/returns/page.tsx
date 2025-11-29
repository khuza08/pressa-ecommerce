// src/app/returns/page.tsx
export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Returns & Exchanges</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
          <p className="mb-4">
            We want you to be completely satisfied with your purchase. If you're not happy with your items, you can return or exchange them within 30 days of delivery.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">Eligibility</h2>
          <p className="mb-4">
            Items must be in their original condition with tags attached. Items that show signs of wear, washing, or alteration cannot be returned. All swimwear, jewelry, and undergarments must be unworn with protective liners in place.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">How to Return</h2>
          <ol className="list-decimal pl-6 mb-6">
            <li>Log into your account and go to "My Orders"</li>
            <li>Select the order and item(s) you wish to return</li>
            <li>Print the prepaid return label</li>
            <li>Pack the item(s) securely with the original packaging if possible</li>
            <li>Drop off the package at your nearest carrier location</li>
          </ol>
          
          <h2 className="text-xl font-semibold mb-4">Refunds</h2>
          <p className="mb-4">
            Once we receive your return, we will inspect the items and process your refund. Refunds will be issued to the original payment method within 5-7 business days. You will receive an email confirmation when the refund is processed.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">Exchanges</h2>
          <p>
            For exchanges, please return the original item using the return process above and place a new order for the replacement item. We do not process direct exchanges.
          </p>
        </div>
      </div>
    </div>
  );
}