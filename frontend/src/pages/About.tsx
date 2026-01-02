import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">About Us</h1>
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-border prose prose-slate">
                    <p className="lead text-xl text-muted-foreground mb-6">
                        Zythova is your premium shopping destination, redefining the online shopping experience with quality, speed, and reliability.
                    </p>

                    <h3>Our Story</h3>
                    <p>
                        Founded in 2024, Zythova began with a simple mission: to make high-quality products accessible to everyone, everywhere.
                        We noticed a gap in the market for a platform that combines a curated selection of premium goods with a seamless, user-friendly interface.
                    </p>

                    <h3>Our Mission</h3>
                    <p>
                        We are dedicated to providing our customers with the best online shopping experience possible. This means offering a wide variety of
                        products at competitive prices, ensuring fast and reliable delivery, and providing exceptional customer service.
                    </p>

                    <h3>Our Values</h3>
                    <ul>
                        <li><strong>Quality:</strong> We never compromise on the quality of our products.</li>
                        <li><strong>Customer First:</strong> Our customers are at the heart of everything we do.</li>
                        <li><strong>Innovation:</strong> We are constantly looking for new ways to improve.</li>
                        <li><strong>Integrity:</strong> We believe in honest and transparent business practices.</li>
                    </ul>

                    <h3>The Team</h3>
                    <p>
                        Our team is made up of passionate individuals who are experts in their fields. From our buyers who scour the globe for the best products,
                        to our tech team who ensures our platform runs smoothly, everyone at Zythova is committed to excellence.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
