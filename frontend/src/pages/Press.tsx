import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Press = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">Press & Media</h1>
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-border">
                    <div className="prose prose-slate mb-12">
                        <p className="lead">
                            Welcome to the Zythova Press Room. Here you'll find our latest news, press releases, and media resources.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="border-b border-border pb-8">
                            <span className="text-sm text-muted-foreground">January 15, 2025</span>
                            <h3 className="text-xl font-semibold mt-2 mb-3">Zythova Launches Revolutionary New Shopping App</h3>
                            <p className="text-muted-foreground mb-4">
                                Today Zythova announced the launch of its new mobile application, designed to bring a seamless shopping experience to users on the go...
                            </p>
                            <a href="#" className="text-primary hover:underline font-medium">Read More</a>
                        </div>

                        <div className="border-b border-border pb-8">
                            <span className="text-sm text-muted-foreground">November 20, 2024</span>
                            <h3 className="text-xl font-semibold mt-2 mb-3">Zythova Expands to International Markets</h3>
                            <p className="text-muted-foreground mb-4">
                                Zythova confirms its expansion into the European and North American markets, offering faster shipping and local support...
                            </p>
                            <a href="#" className="text-primary hover:underline font-medium">Read More</a>
                        </div>

                        <div>
                            <span className="text-sm text-muted-foreground">September 05, 2024</span>
                            <h3 className="text-xl font-semibold mt-2 mb-3">Zythova Partners with Local Artisans</h3>
                            <p className="text-muted-foreground mb-4">
                                In an effort to support local communities, Zythova has launched a new initiative to feature products from local artisans and craftsmen...
                            </p>
                            <a href="#" className="text-primary hover:underline font-medium">Read More</a>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-muted rounded-lg">
                        <h4 className="font-bold mb-2">Media Contact</h4>
                        <p className="text-sm text-muted-foreground">
                            For press inquiries, please contact:<br />
                            <a href="mailto:press@zythova.com" className="text-primary hover:underline">press@zythova.com</a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Press;
