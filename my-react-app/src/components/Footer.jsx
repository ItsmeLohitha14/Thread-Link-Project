import React from 'react';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-10 grid md:grid-cols-4 gap-8 text-gray-700 pb-10">
        
        {/* Logo + Description */}
        <div>
          <div className="text-2xl font-bold text-green-600 flex items-center gap-1 mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16v16H4z" stroke="none" />
            </svg>
            Thread<span className="text-orange-500">Link</span>
          </div>
          <p className="text-sm leading-relaxed">
            Promoting sustainable fashion by connecting donors with those in need. Together, we're reducing waste and making a positive impact.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-600">Browse Clothes</a></li>
            <li><a href="#" className="hover:text-green-600">Donate Items</a></li>
            <li><a href="#about" className="hover:text-green-600">About Us</a></li>
            <li><a href="#" className="hover:text-green-600">Our Impact</a></li>
            <li><a href="#" className="hover:text-green-600">FAQ</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-600">Sustainable Fashion Blog</a></li>
            <li><a href="#" className="hover:text-green-600">Partner Organizations</a></li>
            <li><a href="#" className="hover:text-green-600">Volunteer Opportunities</a></li>
            <li><a href="#" className="hover:text-green-600">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-green-600">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contact Us</h4>
          <p className="text-sm mb-2">Questions or suggestions? Reach out to us!</p>
          <p className="flex items-center text-sm gap-2 mb-4">
            <Mail className="w-4 h-4 text-green-600" />
            <a href="mailto:info@closetshare.com" className="hover:text-green-700">info@closetshare.com</a>
          </p>

          {/* Newsletter Box */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="text-sm font-semibold mb-2">Join Our Newsletter</h5>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 border rounded-l-md text-sm focus:outline-none"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-r-md text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t text-sm text-center text-gray-500 py-4">
        © 2025 ThreadLink. All rights reserved. &nbsp;|&nbsp; Made with <span className="text-orange-500">🧡</span> for a better planet
      </div>
    </footer>
  );
};

export default Footer;
