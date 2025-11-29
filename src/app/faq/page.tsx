// src/app/faq/page.tsx
export default function FAQPage() {
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days, while express shipping takes 1-2 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unused items in their original packaging. Please contact us for a return authorization."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we offer international shipping to most countries. Shipping costs and delivery times vary depending on your location."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order has shipped, you will receive an email with a tracking number and link to track your package."
    },
    {
      question: "Are your products ethically sourced?",
      answer: "Yes, all our products are ethically sourced and manufactured under fair labor conditions."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}