import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                    </div>

                    {/* Document Container */}
                    <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100">
                        {/* Introduction */}
                        <div className="mb-10 text-lg text-gray-700 leading-relaxed">
                            <p>
                                <span className="font-semibold text-gray-900">Zythova</span> (“we”, “our”, “us”) values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data when you use our website or services.
                            </p>
                        </div>

                        {/* Sections */}
                        <div className="space-y-10">
                            {/* Section 1 */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                                    Information We Collect
                                </h2>

                                <div className="pl-0 md:pl-11 space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">1) Personal Information</h3>
                                        <p className="text-gray-600 mb-3">We may collect the following:</p>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {['Full name', 'Mobile number', 'Email address', 'Shipping and billing address', 'Payment details (processed securely via third-party gateways)'].map((item, i) => (
                                                <li key={i} className="flex items-start text-gray-600">
                                                    <span className="mr-2 text-primary">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">2) Technical & Usage Information</h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {['IP address', 'Device and browser details', 'Website usage behavior', 'Cookies and analytics data'].map((item, i) => (
                                                <li key={i} className="flex items-start text-gray-600">
                                                    <span className="mr-2 text-primary">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                    How We Use Your Information
                                </h2>
                                <div className="pl-0 md:pl-11">
                                    <p className="text-gray-600 mb-4">We use your information to:</p>
                                    <ul className="space-y-3">
                                        {['Process orders and payments', 'Deliver products and provide customer support', 'Manage returns, refunds, and rewards', 'Send order updates, offers, and notifications', 'Prevent fraud and ensure platform security'].map((item, i) => (
                                            <li key={i} className="flex items-center text-gray-700 bg-gray-50 px-4 py-2 rounded-md border border-gray-100">
                                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                                    Data Sharing & Disclosure
                                </h2>
                                <div className="pl-0 md:pl-11 text-gray-600">
                                    <p className="mb-4 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                                        <strong>Note:</strong> Zythova does not sell or rent your personal data.
                                    </p>
                                    <p className="mb-3">We may share data only with:</p>
                                    <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                                        <li>Logistics and delivery partners (order fulfillment)</li>
                                        <li>Secure payment gateways (payment processing)</li>
                                        <li>Legal or regulatory authorities, when required by law</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                                    Data Security
                                </h2>
                                <div className="pl-0 md:pl-11">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { title: 'Secure Servers', desc: 'Encrypted connections used' },
                                            { title: 'Payment Info', desc: 'Not stored on our servers' },
                                            { title: 'Monitoring', desc: 'Regular security checks' },
                                        ].map((item, i) => (
                                            <div key={i} className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                                <div className="text-primary mb-2">
                                                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                                </div>
                                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                                    Cookies Policy
                                </h2>
                                <div className="pl-0 md:pl-11 text-gray-600">
                                    <p className="mb-3">We use cookies to:</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {['Improve functionality', 'Enhance experience', 'Analyze traffic'].map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{tag}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 italic">You may disable cookies through your browser settings</p>
                                </div>
                            </section>

                            {/* Section 6 */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">6</span>
                                    User Rights
                                </h2>
                                <div className="pl-0 md:pl-11 text-gray-600">
                                    <p className="mb-3">You have the right to:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                            Access and update your personal information
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                            Request account deletion
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                            Opt out of promotional communications
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 7 */}
                            <section className="bg-gray-900 text-white p-8 rounded-xl mt-12">
                                <h2 className="text-xl font-bold mb-6 text-white">Policy Updates & Contact</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-semibold text-gray-300 mb-2">Updates</h3>
                                        <p className="text-gray-400 text-sm">
                                            Zythova may update this Privacy Policy from time to time.
                                            Any changes will be published on this page.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-300 mb-2">Contact Us</h3>
                                        <p className="text-gray-400 text-sm mb-2">Questions about our privacy practices?</p>
                                        <a href="mailto:support@zythova.com" className="inline-flex items-center text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            support@zythova.com
                                        </a>
                                    </div>
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

export default PrivacyPolicy;
