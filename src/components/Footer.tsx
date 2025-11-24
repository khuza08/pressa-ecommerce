// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <address className="not-italic text-sm text-gray-400">
              419 State 414 Rte<br />
              Beaver Dams, New York(NY), 14812, USA
            </address>
            <p className="mt-2 text-sm">📞 (607) 936-8058</p>
            <p className="text-sm">✉️ example@gmail.com</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Prices drop</a></li>
              <li><a href="#" className="hover:text-white">New products</a></li>
            </ul>
          </div>

          {/* Ulangi untuk Company, Services, dll */}
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <img src="/assets/images/payment.png" alt="Payment" className="h-8 mb-4 md:mb-0" />
          <p className="text-sm text-gray-500">
            Copyright &copy; <a href="#" className="hover:underline">Anon</a> all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}