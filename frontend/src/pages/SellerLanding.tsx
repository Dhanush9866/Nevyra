import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Check, TrendingUp, Users, Shield, ArrowRight, Wallet, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const SellerLanding = () => {
    const [orders, setOrders] = useState(500);
    const [avgPrice, setAvgPrice] = useState(1000);

    // Simple profit calculation logic (assuming 20% margin for estimation)
    const potentialEarnings = (orders * avgPrice * 0.20).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    return (
        <div className="min-h-screen bg-white font-roboto">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <div className="relative bg-gradient-to-br from-[#1A1F2C] via-[#2D2B55] to-[#1A1F2C] text-white overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

                <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                    <div className="flex flex-col items-center justify-center text-center">

                        {/* Hero Content */}
                        <div className="space-y-6 max-w-3xl mx-auto">
                            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-sm font-medium border border-white/20 backdrop-blur-sm mx-auto">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span>Join 1 Lakh+ Sellers</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                                Grow Your Business on <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                    India's Fastest Market
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
                                0% Commission for the first 30 days. Reach crores of customers and get payments in just 7 days.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4 justify-center">
                                <a href="https://nevyra-seller.onrender.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-purple-500/30 transition-all hover:scale-105">
                                        Start Selling Now
                                    </Button>
                                </a>
                                <Button variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-full">
                                    Explore Benefits
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* --- HOW TO SELL SECTION --- */}
            <div className="py-16 bg-gray-50 flex justify-center">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="bg-white border border-blue-500/30 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16 relative z-10">
                            How to sell on Zythova?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 relative z-10">
                            {/* Step 1 */}
                            <div className="flex items-center space-x-6 group">
                                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                    <img src="/step-register.png" alt="Register" className="w-32 h-32 object-contain filter drop-shadow-md" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">STEP 1: Register your account</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">Register on Zythova with GST/PAN details and an active bank account</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-center space-x-6 group">
                                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                    <img src="/step-storage.png" alt="Storage" className="w-32 h-32 object-contain filter drop-shadow-md" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">STEP 2: Choose storage & shipping</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">Choose storage, packaging, and delivery options for your products</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-center space-x-6 group">
                                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                    <img src="/step-list.png" alt="List Products" className="w-32 h-32 object-contain filter drop-shadow-md" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">STEP 3: List your products</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">List your products by providing product and brand details simply</p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex items-center space-x-6 group">
                                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                    <img src="/step-orders.png" alt="Get Paid" className="w-32 h-32 object-contain filter drop-shadow-md" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">STEP 4: Complete orders & get paid</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">Deliver orders to customers on time and get paid within 7 days of delivery</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CTA FOOTER --- */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to become a bestseller?</h2>
                    <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">Join the community of 1 Lakh+ successful sellers who trust our platform.</p>
                    <a href="http://localhost:8081" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="bg-[#1A1F2C] hover:bg-black text-white text-lg px-12 py-6 rounded-full shadow-xl">
                            Start Selling Today
                        </Button>
                    </a>
                </div>
            </div>

        </div>
    );
};

export default SellerLanding;
