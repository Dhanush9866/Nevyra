import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  MapPin,
} from "lucide-react";

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
              Your premium shopping destination. Discover amazing products with exceptional quality and enjoy a seamless shopping experience with fast delivery worldwide.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Your Order</a></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground">
              My Account
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Profile</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Order History</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Wishlist</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shopping Cart</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Rewards Program</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground">
              Contact & Social
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-warning" />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">Address:</span> Krosuru, Krosuru Mandal, Palnadu District, Andhra Pradesh - 522410
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-warning" />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">Phone Numbers:</span>
                </span>
              </div>
              <div className="ml-6 space-y-1">
                <p className="text-muted-foreground">+91 97017 96195</p>
                <p className="text-muted-foreground">+91 94400 94282</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2024 Zythova. All rights reserved.</p>
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
