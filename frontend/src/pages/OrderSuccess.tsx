import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  return (
    <div className="page-transition">
      <PageHeader title="Order Placed!" subtitle="Thank you for your purchase." />
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Your order was placed successfully!</h2>
        <p className="text-muted-foreground mb-8">
          We’ve received your order and will send you a confirmation email soon.
        </p>
        <div className="flex flex-col gap-4 items-center">
          <Button className="w-48" onClick={() => navigate("/")}>Go to Home</Button>
          <Button variant="outline" className="w-48" onClick={() => navigate("/orders")}>View My Orders</Button>
        </div>
      </div>
    </div>
  );
} 