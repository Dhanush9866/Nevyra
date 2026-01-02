import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShippingInfo = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">Shipping Information</h1>
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-border prose prose-slate">
                    <h3>Domestic Shipping</h3>
                    <p>
                        We offer free standard shipping on all domestic orders over ₹499. For orders under ₹499, a flat rate of ₹40 applies.
                        Standard shipping typically takes 3-5 business days.
                    </p>

                    <h3>Express Shipping</h3>
                    <p>
                        Need it faster? We offer Express shipping (1-2 business days) for a flat rate of ₹100. Select this option at checkout for priority handling.
                    </p>

                    <h3>International Shipping</h3>
                    <p>
                        We ship to over 50 countries worldwide. International shipping rates are calculated at checkout based on destination and weight.
                        Please note that customs duties and taxes may apply upon arrival in your country and are the responsibility of the customer.
                    </p>

                    <h3>Order Processing</h3>
                    <p>
                        Orders are processed within 1-2 business days. You will receive an email confirmation once your order has been shipped.
                    </p>

                    <h3>Tracking</h3>
                    <p>
                        All orders include tracking information which will be sent to your email upon dispatch.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ShippingInfo;
