import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import TopDeals from "@/components/TopDeals";
import ShopByCategory from "@/components/ShopByCategory";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      <HeroBanner />
      <TopDeals />
      <ShopByCategory />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Index;
