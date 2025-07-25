import { Link } from "react-router-dom";
import { Heart, Facebook, Twitter, Instagram, Youtube, Smartphone, Monitor } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.jpg" alt="Nevyra Logo" className="w-8 h-8 rounded-lg object-contain" />
              <span className="text-xl font-bold">Nevyra</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Your premium shopping destination. Discover amazing products with exceptional quality 
              and enjoy a seamless shopping experience with fast delivery worldwide.
            </p>
            
            {/* App Store Badges */}
            
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold mb-4">My Account</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/profile" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Rewards Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Contact+Social as a flex-row on large screens */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Company */}
            <div className="flex-1 min-w-[180px]">
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            {/* Contact & Social */}
            <div className="flex-1 min-w-[220px]">
              <h3 className="font-semibold mb-4">Contact & Social</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <span className="block font-medium">📍 Address:</span>
                  <span>Krosuru, Krosuru Mandal,<br />Palnadu District, Andhra Pradesh – 522410</span>
                </li>
                <li>
                  <span className="block font-medium">📞 Phone Numbers:</span>
                  <span>+91 97017 96195<br />+91 94400 94282</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-8 mt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-sm text-primary-foreground/80">
                © 2024 Nevyra. All rights reserved.
              </p>
              <p className="text-sm text-primary-foreground/80 flex items-center">
                Made with <Heart className="h-4 w-4 mx-1 text-accent" fill="currentColor" /> for great shopping
              </p>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Follow us:</span>
              <div className="flex space-x-3">
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/nevyra_india" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};