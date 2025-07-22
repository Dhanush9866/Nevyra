import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Truck, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { getCart, setCart } from "@/lib/cart";
import { useNavigate } from "react-router-dom";

// Address type
const ADDRESS_KEY = "addresses";
function getAddresses() {
  try {
    const data = localStorage.getItem(ADDRESS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function setAddresses(addresses: any[]) {
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
}

type Address = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
};

export default function Checkout() {
  console.log("Checkout page mounted");
  // State for payment fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  // State for shipping fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");

  // Extend errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Address, 2: Summary, 3: Payment
  const [addresses, setAddressesState] = useState<Address[]>([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Load addresses from localStorage on mount
  useEffect(() => {
    console.log("Current step:", step);
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (step === 1) {
      if (!token) return;
      fetch("http://localhost:8000/api/users/addresses", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          console.log("Fetched addresses:", data);
          if (data.success && Array.isArray(data.data)) {
            setAddressesState(data.data);
            setShowAddressForm(data.data.length === 0);
          } else {
            setAddressesState([]);
            setShowAddressForm(true);
          }
        })
        .catch((err) => {
          console.error("Address fetch error:", err);
          setAddressesState([]);
          setShowAddressForm(true);
        });
    }
  }, [step]);

  // Add new address handler
  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    // Validate address fields (reuse shipping validation)
    const newErrors: any = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email address";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,15}$/.test(phone)) newErrors.phone = "Invalid phone number";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    else if (!/^\d{4,10}$/.test(zipCode)) newErrors.zipCode = "Invalid ZIP code";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    if (Object.keys(newErrors).length > 0) return;
    // POST to backend
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8000/api/users/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, email, phone, address, city, zipCode }),
      });
      const data = await response.json();
      console.log("Add address response:", data);
      if (!response.ok) {
        setErrors((prev) => ({ ...prev, form: data.message || "Failed to add address" }));
        return;
      }
      // Refresh address list
      fetch("http://localhost:8000/api/users/addresses", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          console.log("Refetched addresses after add:", data);
          if (data.success && Array.isArray(data.data)) {
            setAddressesState(data.data);
            setShowAddressForm(data.data.length === 0);
          }
        });
      setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setAddress(""); setCity(""); setZipCode("");
      setSelectedAddressIdx(null);
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: "Failed to add address" }));
    }
  }

  // Validation function
  function validateAll() {
    const newErrors: any = {};
    // Shipping validation
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email address";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    else if (!/^\d{4,10}$/.test(zipCode)) newErrors.zipCode = "Invalid ZIP code";
    // Payment validation
    if (!cardName.trim()) newErrors.cardName = "Name on card is required";
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) newErrors.cardNumber = "Card number must be 16 digits";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) newErrors.expiry = "Expiry must be MM/YY";
    if (!/^\d{3,4}$/.test(cvv)) newErrors.cvv = "CVV must be 3 or 4 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleCompleteOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!validateAll()) return;
    setIsPlacingOrder(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to place an order.");
        setIsPlacingOrder(false);
        return;
      }
      // Place order API call
      const response = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment: {
            cardName,
            cardNumber: cardNumber.replace(/\s/g, ""),
            expiry,
            cvv,
          },
          shipping: {
            firstName,
            lastName,
            email,
            address,
            city,
            zipCode,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Order failed. Please try again.");
        setIsPlacingOrder(false);
        return;
      }
      setCart([]);
      navigate("/order-success");
    } catch (err) {
      alert("Order failed. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  }

  // Step 1: Address selection/entry
  function renderAddressStep() {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length > 0 && !showAddressForm && (
            <>
              {addresses.map((addr, idx) => (
                <div key={idx} className={`flex items-center border rounded-lg p-3 mb-2 ${selectedAddressIdx === idx ? 'border-primary' : 'border-border'}`}>
                  <input type="radio" name="address" checked={selectedAddressIdx === idx} onChange={() => setSelectedAddressIdx(idx)} className="mr-3" />
                  <div className="flex-1">
                    <div className="font-semibold">{addr.firstName} {addr.lastName}</div>
                    {addr.phone && <div className="text-sm text-muted-foreground">{addr.phone}</div>}
                    <div className="text-sm text-muted-foreground">{addr.address}, {addr.city}, {addr.zipCode}</div>
                    <div className="text-xs text-muted-foreground">{addr.email}</div>
                  </div>
                  {selectedAddressIdx === idx && (
                    <Button className="ml-4" size="sm" onClick={() => setStep(2)}>Deliver Here</Button>
                  )}
                </div>
              ))}
              <Button variant="outline" className="mt-2" onClick={() => setShowAddressForm(true)}>+ Add a new address</Button>
            </>
          )}
          {addresses.length === 0 && !showAddressForm && (
            <div className="text-muted-foreground text-sm">No addresses found. Please add a new address.</div>
          )}
          {(addresses.length === 0 || showAddressForm) && (
            <div className="space-y-2">
              {errors.form && <div className="text-destructive text-xs mb-2">{errors.form}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} />
                  {submitAttempted && errors.firstName && (<div className="text-destructive text-xs mt-1">{errors.firstName}</div>)}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />
                  {submitAttempted && errors.lastName && (<div className="text-destructive text-xs mt-1">{errors.lastName}</div>)}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                {submitAttempted && errors.email && (<div className="text-destructive text-xs mt-1">{errors.email}</div>)}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value)} />
                {submitAttempted && errors.phone && (<div className="text-destructive text-xs mt-1">{errors.phone}</div>)}
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main Street" value={address} onChange={e => setAddress(e.target.value)} />
                {submitAttempted && errors.address && (<div className="text-destructive text-xs mt-1">{errors.address}</div>)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" value={city} onChange={e => setCity(e.target.value)} />
                  {submitAttempted && errors.city && (<div className="text-destructive text-xs mt-1">{errors.city}</div>)}
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" placeholder="10001" value={zipCode} onChange={e => setZipCode(e.target.value)} />
                  {submitAttempted && errors.zipCode && (<div className="text-destructive text-xs mt-1">{errors.zipCode}</div>)}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="button" onClick={e => handleAddAddress(e)}>Save Address</Button>
                {addresses.length > 0 && <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Step 2: Order summary confirmation
  function renderSummaryStep() {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full mt-4" onClick={() => setStep(3)}>Continue to Payment</Button>
        </CardContent>
      </Card>
    );
  }

  // Step 3: Payment (existing payment form)
  function renderPaymentStep() {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cardName">Name on Card</Label>
            <Input id="cardName" placeholder="John Doe" value={cardName} onChange={e => setCardName(e.target.value)} />
            {submitAttempted && errors.cardName && (
              <div className="text-destructive text-xs mt-1">{errors.cardName}</div>
            )}
          </div>
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
            {submitAttempted && errors.cardNumber && (
              <div className="text-destructive text-xs mt-1">{errors.cardNumber}</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" maxLength={5} value={expiry} onChange={e => setExpiry(e.target.value)} />
              {submitAttempted && errors.expiry && (
                <div className="text-destructive text-xs mt-1">{errors.expiry}</div>
              )}
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" maxLength={4} type="password" value={cvv} onChange={e => setCvv(e.target.value)} />
              {submitAttempted && errors.cvv && (
                <div className="text-destructive text-xs mt-1">{errors.cvv}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Order summary sidebar (always visible)
  function renderOrderSummarySidebar() {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎧</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Premium Wireless Headphones</p>
                  <p className="text-sm text-muted-foreground">Qty: 1</p>
                </div>
                <span className="font-medium">₹299</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-lg">⌚</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Smart Watch Pro</p>
                  <p className="text-sm text-muted-foreground">Qty: 2</p>
                </div>
                <span className="font-medium">₹898</span>
              </div>
            </div>

            <Separator />

            {/* Pricing Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹1,197</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₹15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>₹96</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹1,308</span>
              </div>
            </div>

            <Button className="w-full btn-accent text-lg py-3" type="submit" disabled={isPlacingOrder}>
              {isPlacingOrder ? "Placing Order..." : "Complete Order"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <PageHeader title="Checkout" subtitle="Complete your purchase securely" />
      <form onSubmit={handleCompleteOrder}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {step === 1 && renderAddressStep()}
              {step === 2 && renderSummaryStep()}
              {step === 3 && renderPaymentStep()}
            </div>
            <div>
              {renderOrderSummarySidebar()}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}