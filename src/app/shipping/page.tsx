// src/app/shipping/page.tsx
export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">Domestic Shipping</h2>
          <p className="mb-4">
            We offer multiple shipping options for domestic orders within Indonesia:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Standard Shipping:</strong> 3-5 business days, Rp15.000 or free on orders over Rp200.000</li>
            <li><strong>Express Shipping:</strong> 1-2 business days, Rp30.000</li>
            <li><strong>Overnight Shipping:</strong> Next business day, Rp50.000</li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4">International Shipping</h2>
          <p className="mb-4">
            We ship to most countries worldwide with the following options:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Standard International:</strong> 7-14 business days, calculated at checkout</li>
            <li><strong>Express International:</strong> 5-10 business days, calculated at checkout</li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4">Processing Time</h2>
          <p className="mb-4">
            Orders are processed and shipped within 1-2 business days. Orders placed after 2 PM EST may be processed the following business day.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">Tracking</h2>
          <p className="mb-4">
            Once your order ships, you will receive an email with tracking information. You can also track your order through your account dashboard.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">Damaged or Lost Packages</h2>
          <p>
            If your package arrives damaged or is reported as delivered but not received, please contact us within 7 days of delivery notification for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}