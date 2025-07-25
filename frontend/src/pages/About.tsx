import React from "react";

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 flex items-center justify-center py-12 px-2">
    <div className="w-full bg-white/90 rounded-2xl shadow-2xl border border-blue-100 p-8 sm:p-12">
      <h1 className="text-3xl font-extrabold mb-6 text-primary border-l-8 border-pink-400 pl-4 bg-gradient-to-r from-blue-500/10 to-pink-400/10 py-2">Welcome to NEVYRA – Your Trusted Shopping Destination</h1>
      <p className="mb-4 text-lg text-gray-700">
        At <span className="font-semibold text-primary">NEVYRA</span>, we are redefining the online shopping experience by bringing together quality, affordability, and trust. Based in <span className="font-semibold text-pink-500">Krosuru, Palnadu District, Andhra Pradesh</span>, NEVYRA was founded with a vision to make daily essentials, electronics, fashion, and household goods easily accessible to every home — from small towns to big cities.
      </p>
      <p className="mb-4 text-lg text-gray-700">
        <span className="font-bold text-primary">Our mission is simple:</span><br />
        To provide reliable, high-quality products at competitive prices, while supporting local supply chains and ensuring customer satisfaction.
      </p>
      <p className="mb-4 text-lg text-gray-700">
        We started this journey in <span className="font-semibold text-yellow-500">2025</span>, driven by the idea that even the most rural parts of India deserve world-class shopping services. With a focus on customer-first service, verified suppliers, and fast delivery, NEVYRA stands out by blending modern e-commerce with Indian values.
      </p>
      <div className="mb-4 text-lg">
        <span className="font-bold text-primary">Why Choose NEVYRA?</span>
        <ul className="list-none pl-0 mt-4 space-y-2">
          <li className="flex items-center gap-2"><span className="inline-block w-5 h-5 bg-gradient-to-tr from-blue-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">✔</span> Carefully curated products</li>
          <li className="flex items-center gap-2"><span className="inline-block w-5 h-5 bg-gradient-to-tr from-blue-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">✔</span> Transparent pricing</li>
          <li className="flex items-center gap-2"><span className="inline-block w-5 h-5 bg-gradient-to-tr from-blue-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">✔</span> Reliable delivery to remote areas</li>
          <li className="flex items-center gap-2"><span className="inline-block w-5 h-5 bg-gradient-to-tr from-blue-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">✔</span> Friendly customer support</li>
        </ul>
      </div>
      <p className="mb-2 text-lg text-gray-700">
        Join thousands of happy customers who trust <span className="font-semibold text-primary">NEVYRA</span> for their everyday needs. We’re more than just a store – we’re a growing community.
      </p>
    </div>
  </div>
);

export default About; 