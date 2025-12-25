import { Link } from "react-router-dom";
import {
    Building2,
    ShoppingBasket,
    Shirt,
    Monitor,
    Zap,
    Car,
    Dumbbell,
    Armchair
} from "lucide-react";

// This component implements the specific grid layout requested by the user
// featuring 3D-style illustrations with white label bars

const categories = [
    {
        id: 1,
        title: "Medical & Pharmacy",
        icon: Building2,
        image: "/categories/medical-real.png",
        path: "/category/medical-and-pharmacy",
        color: "bg-blue-50"
    },
    {
        id: 2,
        title: "Groceries",
        icon: ShoppingBasket,
        image: "/categories/groceries-real.jpg",
        path: "/category/groceries",
        color: "bg-green-50"
    },
    {
        id: 3,
        title: "Fashion & Beauty",
        icon: Shirt,
        image: "/categories/fashion-real.jpg",
        path: "/category/fashion-and-beauty",
        color: "bg-purple-50"
    },
    {
        id: 4,
        title: "Devices",
        icon: Monitor,
        image: "/categories/devices-real.png",
        path: "/category/devices",
        color: "bg-blue-50"
    },
    {
        id: 5,
        title: "Electrical",
        icon: Zap,
        image: "/categories/electrical-real.png",
        path: "/category/electrical",
        color: "bg-yellow-50"
    },
    {
        id: 6,
        title: "Automotive",
        icon: Car,
        image: "/categories/automotive-real.png",
        path: "/category/automotive",
        color: "bg-stone-100"
    },
    {
        id: 7,
        title: "Sports",
        icon: Dumbbell,
        image: "/categories/sports-real.png",
        path: "/category/sports",
        color: "bg-indigo-50"
    },
    {
        id: 8,
        title: "Home Interior",
        icon: Armchair,
        image: "/categories/home-real.png",
        path: "/category/home-interior",
        color: "bg-orange-50"
    }
];

const ShopByCategory = () => {
    return (
        <section className="py-12 bg-background font-roboto">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-semibold text-foreground mb-8">
                    Shop by Category
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.id}
                                to={category.path}
                                className="group block relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                {/* Card Container */}
                                <div className={`h-48 ${category.color} relative overflow-hidden`}>
                                    {/* Image Area */}
                                    <div className="absolute inset-0 flex items-center justify-center p-6">
                                        <img
                                            src={category.image}
                                            alt={category.title}
                                            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Label Area */}
                                <div className="bg-white p-4 flex items-center justify-center gap-3 border-t border-gray-100">
                                    <Icon className={`w-5 h-5 text-gray-400 group-hover:text-primary transition-colors`} />
                                    <span className="font-medium text-gray-700 group-hover:text-primary transition-colors text-base">
                                        {category.title}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ShopByCategory;
