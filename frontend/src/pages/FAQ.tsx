import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">Frequently Asked Questions</h1>
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-border">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How long does shipping take?</AccordionTrigger>
                            <AccordionContent>
                                Shipping typically takes 3-5 business days for domestic orders and 7-14 business days for international orders. Express options are available at checkout.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>What is your return policy?</AccordionTrigger>
                            <AccordionContent>
                                We accept returns within 30 days of purchase. Items must be unused and in original packaging. Please visit our Returns page for more details.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
                            <AccordionContent>
                                Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>How can I track my order?</AccordionTrigger>
                            <AccordionContent>
                                Once your order ships, you will receive a confirmation email with a tracking number. You can also view tracking information in your account under "Order History".
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                            <AccordionContent>
                                We accept major credit cards (Visa, MasterCard, Amex), PayPal, and Cash on Delivery (COD) for eligible locations.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FAQ;
