import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Terms of Services</h1>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                    </div>

                    {/* Document Container */}
                    <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100">
                        {/* Introduction */}
                        <div className="mb-10 text-lg text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                            <p>
                                <span className="font-semibold text-gray-900">Zythova</span> Terms of Services
                            </p>
                            <p className="mt-2 text-gray-600">
                                By accessing or using the Zythova website or mobile application, you agree to these Terms of Service
                            </p>
                        </div>

                        {/* Sections */}
                        <div className="space-y-10">
                            {/* Section 1: Platform Overview */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                                    Platform Overview
                                </h2>
                                <div className="pl-0 md:pl-11 text-gray-600 space-y-3">
                                    <p className="flex items-start">
                                        <span className="mr-2 text-primary mt-1">•</span>
                                        Zythova is an e-commerce marketplace platform that connects buyers and sellers.
                                    </p>
                                    <p className="flex items-start">
                                        <span className="mr-2 text-primary mt-1">•</span>
                                        Zythova is not the owner of seller-listed products unless explicitly stated.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2: User Account Responsibility */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                    User Account Responsibility
                                </h2>
                                <div className="pl-0 md:pl-11">
                                    <ul className="grid grid-cols-1 gap-3">
                                        {[
                                            'Users must provide accurate and complete information',
                                            'You are responsible for maintaining account security',
                                            'Notify us immediately of any unauthorized account activity'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center text-gray-700 bg-gray-50 px-4 py-3 rounded-md border border-gray-100">
                                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3: Orders & Payments */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                                    Orders & Payments
                                </h2>
                                <div className="pl-0 md:pl-11">
                                    <ul className="space-y-3">
                                        {[
                                            'Orders are confirmed only after successful payment',
                                            'Prices, availability, and offers are seller-defined',
                                            'Zythova is not responsible for payment gateway failures'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start text-gray-600">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4: Shipping & Delivery */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                                    Shipping & Delivery
                                </h2>
                                <div className="pl-0 md:pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { title: 'Timelines', desc: 'Delivery timelines are estimates, not guarantees' },
                                        { title: 'Addresses', desc: 'Incorrect address details may lead to delivery failure' },
                                        { title: 'Delays', desc: 'Delays due to natural disasters or logistics issues are not Zythova’s liability' }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Section 5: Returns & Refunds */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                                    Returns & Refunds
                                </h2>
                                <div className="pl-0 md:pl-11 bg-orange-50 p-6 rounded-lg border border-orange-100">
                                    <ul className="space-y-3">
                                        {[
                                            'Return eligibility depends on product category and seller policy',
                                            'Refunds are processed to the original payment method',
                                            'Abuse of return policy may result in account suspension'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start text-gray-700">
                                                <span className="text-orange-500 font-bold mr-2">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Section 6: Seller Responsibilities */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">6</span>
                                    Seller Responsibilities
                                </h2>
                                <div className="pl-0 md:pl-11">
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-primary mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <span className="text-gray-700">Sellers are responsible for product quality and authenticity</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-red-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                <span className="text-gray-700">Sale of illegal or counterfeit products is strictly prohibited</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-red-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                                <span className="text-gray-700">Violations may result in seller account termination</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Intellectual Property & Liability */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">7</span>
                                        Intellectual Property
                                    </h2>
                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 h-full">
                                        <p className="text-sm text-gray-600 mb-3">All Zythova content, logos, designs, and trademarks are the intellectual property of Zythova.</p>
                                        <p className="text-sm font-semibold text-gray-900">Unauthorized use is strictly prohibited</p>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">8</span>
                                        Limitation of Liability
                                    </h2>
                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 h-full">
                                        <p className="text-sm font-semibold text-gray-900 mb-2">Zythova:</p>
                                        <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                                            <li>Is not liable for indirect or consequential losses</li>
                                            <li>Acts only as a mediator in buyer-seller disputes</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 8: Account Suspension */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">9</span>
                                    Account Suspension
                                </h2>
                                <div className="pl-0 md:pl-11">
                                    <p className="mb-3 text-gray-700">Zythova reserves the right to suspend or terminate accounts for:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Fraudulent activities', 'Policy violations', 'Legal or regulatory non-compliance'].map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-sm font-medium">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Section 9: Governing Law & Jurisdiction */}
                            <section className="bg-gray-900 text-white p-8 rounded-xl mt-12">
                                <h2 className="text-xl font-bold mb-4 text-white">Governing Law & Jurisdiction</h2>
                                <div className="space-y-2 text-gray-300">
                                    <p className="flex items-center">
                                        <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                                        These Terms are governed by the laws of <span className="text-white font-semibold ml-1">India</span>.
                                    </p>
                                    <p className="flex items-center">
                                        <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        Jurisdiction: <span className="text-white font-semibold ml-1">Andhra Pradesh, India</span>
                                    </p>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
