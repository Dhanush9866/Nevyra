import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Careers = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-4 text-center text-primary">Careers at Zythova</h1>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Join our team and help us build the future of e-commerce. We are always looking for talented individuals who are passionate about making a difference.
                </p>

                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Job Opening 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-xl font-semibold">Senior Frontend Engineer</h3>
                            <p className="text-sm text-muted-foreground">Remote • Engineering • Full-time</p>
                        </div>
                        <Button variant="outline">View Details</Button>
                    </div>

                    {/* Job Opening 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-xl font-semibold">Product Designer</h3>
                            <p className="text-sm text-muted-foreground">Bangalore, India • Design • Full-time</p>
                        </div>
                        <Button variant="outline">View Details</Button>
                    </div>

                    {/* Job Opening 3 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-xl font-semibold">Customer Support Specialist</h3>
                            <p className="text-sm text-muted-foreground">Remote • Support • Full-time</p>
                        </div>
                        <Button variant="outline">View Details</Button>
                    </div>

                    <div className="text-center mt-12">
                        <p className="mb-4">Don't see a role that fits? Send us your resume anyway!</p>
                        <Button>Email Us</Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Careers;
