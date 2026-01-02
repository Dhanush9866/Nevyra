import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">Privacy Policy</h1>
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-border prose prose-slate">
                    <p className="text-sm text-muted-foreground mb-6">Last Updated: January 01, 2025</p>

                    <h3>1. Introduction</h3>
                    <p>
                        Zythova ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy.
                        This policy describes the types of information we may collect from you or that you may provide when you visit our website.
                    </p>

                    <h3>2. Information We Collect</h3>
                    <p>
                        We collect several types of information from and about users of our Website, including information:
                    </p>
                    <ul>
                        <li>By which you may be personally identified, such as name, postal address, e-mail address, telephone number ("personal information");</li>
                        <li>About your internet connection, the equipment you use to access our Website, and usage details.</li>
                    </ul>

                    <h3>3. How We Use Your Information</h3>
                    <p>
                        We use information that we collect about you or that you provide to us, including any personal information:
                    </p>
                    <ul>
                        <li>To present our Website and its contents to you.</li>
                        <li>To provide you with information, products, or services that you request from us.</li>
                        <li>To fulfill any other purpose for which you provide it.</li>
                        <li>To notify you about changes to our Website or any products or services we offer or provide though it.</li>
                    </ul>

                    <h3>4. Data Security</h3>
                    <p>
                        We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
                        All information you provide to us is stored on our secure servers behind firewalls.
                    </p>

                    <h3>5. Contact Information</h3>
                    <p>
                        To ask questions or comment about this privacy policy and our privacy practices, contact us at: <a href="mailto:support@zythova.com">support@zythova.com</a>.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
