import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Returns = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">Returns & Exchanges</h1>
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-border prose prose-slate">
                    <h3>Return Policy</h3>
                    <p>
                        We want you to be completely satisfied with your purchase. If you are not happy with your item, you may return it within 30 days of delivery for a full refund or exchange.
                    </p>

                    <h3>Eligibility</h3>
                    <ul>
                        <li>Items must be unused and in the same condition that you received them.</li>
                        <li>Items must be in the original packaging.</li>
                        <li>Receipt or proof of purchase is required.</li>
                    </ul>

                    <h3>How to Initiate a Return</h3>
                    <ol>
                        <li>Go to your "Order History" in your account.</li>
                        <li>Select the order containing the item you wish to return.</li>
                        <li>Click on the "Return Item" button next to the product.</li>
                        <li>Select the reason for return and submit the request.</li>
                        <li>Once approved, you will receive instructions on how to ship the item back to us.</li>
                    </ol>

                    <h3>Refunds</h3>
                    <p>
                        Once your return is received and inspected, we will send you an email to notify you that we have received your returned item.
                        We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed,
                        and a credit will automatically be applied to your original method of payment within 5-7 business days.
                    </p>

                    <h3>Exchanges</h3>
                    <p>
                        We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at support@zythova.com.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Returns;
