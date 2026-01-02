import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Gift, Award, Star } from "lucide-react";

const Rewards = () => {
    return (
        <div className="min-h-screen bg-background font-roboto">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4 text-primary">Zythova Rewards Program</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Join our exclusive rewards program and earn points for every purchase. Redeem your points for discounts, free shipping, and exclusive gifts.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-border text-center">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Star className="text-primary w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Earn Points</h3>
                        <p className="text-sm text-muted-foreground">
                            Earn 1 point for every ₹100 you spend. Plus, earn bonus points for writing reviews and referring friends.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-border text-center">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Gift className="text-primary w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
                        <p className="text-sm text-muted-foreground">
                            Use your points to get discounts on future purchases. 100 points = ₹10. No minimum redemption.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-border text-center">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award className="text-primary w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Exclusive Perks</h3>
                        <p className="text-sm text-muted-foreground">
                            Get early access to sales, exclusive member-only products, and a special birthday gift.
                        </p>
                    </div>
                </div>

                <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start earning?</h2>
                    <p className="mb-8 opacity-90">Create an account today and get 50 bonus points instantly!</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button variant="secondary" size="lg">Join Now</Button>
                        <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" size="lg">Log In</Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Rewards;
