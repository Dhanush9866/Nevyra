import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">Terms of Service</h1>
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-border prose prose-slate">
                    <p className="text-sm text-muted-foreground mb-6">Last Updated: January 01, 2025</p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this websites particular services,
                        you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>

                    <h3>2. Use License</h3>
                    <p>
                        Permission is granted to temporarily download one copy of the materials (information or software) on Zythova's website for personal, non-commercial transitory viewing only.
                    </p>

                    <h3>3. Disclaimer</h3>
                    <p>
                        The materials on Zythova's website are provided "as is". Zythova makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties,
                        including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>

                    <h3>4. Limitations</h3>
                    <p>
                        In no event shall Zythova or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption)
                        arising out of the use or inability to use the materials on Zythova's Internet site.
                    </p>

                    <h3>5. Governing Law</h3>
                    <p>
                        Any claim relating to Zythova's website shall be governed by the laws of the State of Andhra Pradesh without regard to its conflict of law provisions.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
