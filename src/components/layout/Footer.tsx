import { Link } from "react-router-dom";
import { Shield, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-police-navy text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-8 w-8 text-police-gold" />
              <span className="text-xl font-bold text-police-gold">E-Complaint Portal</span>
            </div>
            <p className="text-sm text-gray-300">
              A secure platform for submitting and managing complaints efficiently.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-police-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-300 hover:text-police-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-police-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-sm text-gray-300 hover:text-police-gold transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-police-gold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-police-gold" />
                <span>Emergency: 911</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-police-gold" />
                <span>support@ecomplaint.gov</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-police-gold" />
                <span>Police Headquarters</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-police-gold mb-4">Working Hours</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Monday - Friday: 24/7</li>
              <li>Saturday: 24/7</li>
              <li>Sunday: 24/7</li>
              <li>Emergency Services: Always Available</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} E-Complaint Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};