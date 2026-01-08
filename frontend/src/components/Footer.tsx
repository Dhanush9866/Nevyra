import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 font-roboto">
      <div className="w-full px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Identity */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/zythova-logo.png"
                alt="Zythova Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-bold text-primary">Zythova</span>
            </div>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              Your premium shopping destination. Discover amazing products with exceptional quality and enjoy a seamless shopping experience with fast delivery.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/shipping-info" className="hover:text-primary transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground">
              My Account
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Order History</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
              <li><Link to="/rewards" className="hover:text-primary transition-colors">Rewards Program</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/press" className="hover:text-primary transition-colors">Press</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground">
              Contact & Social
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-warning mt-1" />
                <span className="text-muted-foreground whitespace-pre-line">
                  <span className="font-medium text-foreground">Address:</span>{" "}
                  5-12/1, Near Tech Valley Towers{"\n"}
                  Madhurawada, Visakhapatnam – 530048{"\n"}
                  Andhra Pradesh, India
                </span>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p>© {new Date().getFullYear()} Zythova. All rights reserved.</p>
            <span className="hidden md:block mx-2">|</span>
            <p className="font-medium">Zythova is operated by SOLNEX Pvt Ltd</p>
          </div>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Facebook className="h-4 w-4 cursor-pointer hover:text-white/80" />
            <Twitter className="h-4 w-4 cursor-pointer hover:text-white/80" />
            <Instagram className="h-4 w-4 cursor-pointer hover:text-white/80" />
            <Youtube className="h-4 w-4 cursor-pointer hover:text-white/80" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
