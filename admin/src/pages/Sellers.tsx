
import React, { useEffect, useState } from "react";
import { FloatingDock } from "@/components/FloatingDock";
import { adminAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface Seller {
    _id: string;
    storeName: string;
    sellerType: string;
    gstNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        mobile: string;
    };
    kycDetails?: {
        panCard: string;
        addressProof: string;
        livePhoto: string;
    };
    bankDetails?: {
        accountHolderName: string;
        accountNumber: string;
        ifscCode: string;
        cancelledCheque: string;
    };
    verificationStatus: 'pending' | 'verified' | 'rejected';
    isVerified: boolean;
    createdAt: string;
}

const Sellers = () => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchSellers = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return;
            const response = await adminAPI.sellers.getAll(token);
            if (response.success) {
                setSellers(response.data);
            }
        } catch (error) {
            toast({
                title: "Error fetching sellers",
                description: "Failed to load sellers",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const handleVerify = async (status: 'verified' | 'rejected') => {
        if (!selectedSeller) return;
        setIsProcessing(true);
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return;

            await adminAPI.sellers.verify(selectedSeller._id, status, token);

            toast({
                title: status === 'verified' ? "Seller Approved" : "Seller Rejected",
                description: `Seller has been ${status} successfully.`,
            });

            // Refresh list
            fetchSellers();
            // We rely on user to close dialog or we can force close if we had open state controlled
        } catch (error) {
            toast({
                title: "Operation failed",
                description: `Failed to ${status} seller.`,
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <FloatingDock />
                <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <FloatingDock />
            <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">Seller Management</h2>
                        <p className="text-muted-foreground">Manage and verify seller accounts</p>
                    </div>

                    <Card className="glass border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle>All Sellers ({sellers.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {sellers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No sellers found.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Store Name</TableHead>
                                            <TableHead>Seller Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sellers.map((seller) => (
                                            <TableRow key={seller._id}>
                                                <TableCell className="font-medium">{seller.storeName}</TableCell>
                                                <TableCell>{seller.user?.firstName} {seller.user?.lastName}</TableCell>
                                                <TableCell>{seller.user?.email}</TableCell>
                                                <TableCell><Badge variant="outline">{seller.sellerType}</Badge></TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        seller.verificationStatus === 'verified' ? 'default' : 
                                                        seller.verificationStatus === 'rejected' ? 'destructive' : 'secondary'
                                                    }>
                                                        {seller.verificationStatus ? seller.verificationStatus.toUpperCase() : 'PENDING'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(seller.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={() => setSelectedSeller(seller)}>
                                                                View Details
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle>Seller Details: {seller.storeName}</DialogTitle>
                                                                <DialogDescription>Review KYC documents and bank details.</DialogDescription>
                                                            </DialogHeader>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                                                {/* Personal Info */}
                                                                <div className="space-y-4">
                                                                    <h3 className="font-semibold text-lg border-b pb-2">Business Details</h3>
                                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                                        <span className="text-muted-foreground">Store Name:</span>
                                                                        <span>{seller.storeName}</span>
                                                                        <span className="text-muted-foreground">GST Number:</span>
                                                                        <span>{seller.gstNumber}</span>
                                                                        <span className="text-muted-foreground">Seller Type:</span>
                                                                        <span>{seller.sellerType}</span>
                                                                        <span className="text-muted-foreground">Status:</span>
                                                                        <span className="capitalize">{seller.verificationStatus}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Bank Details */}
                                                                <div className="space-y-4">
                                                                    <h3 className="font-semibold text-lg border-b pb-2">Bank Details</h3>
                                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                                        <span className="text-muted-foreground">Account Holder:</span>
                                                                        <span>{seller.bankDetails?.accountHolderName}</span>
                                                                        <span className="text-muted-foreground">Account Number:</span>
                                                                        <span>{seller.bankDetails?.accountNumber}</span>
                                                                        <span className="text-muted-foreground">IFSC Code:</span>
                                                                        <span>{seller.bankDetails?.ifscCode}</span>
                                                                    </div>
                                                                    {seller.bankDetails?.cancelledCheque && (
                                                                        <div>
                                                                            <p className="text-sm font-medium mb-2">Cancelled Cheque</p>
                                                                            <div className="border rounded bg-gray-50 h-32 flex items-center justify-center relative group overflow-hidden">
                                                                                <img src={seller.bankDetails.cancelledCheque} alt="Cancelled Cheque" className="w-full h-full object-contain" />
                                                                                <a href={seller.bankDetails.cancelledCheque} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity">
                                                                                    View Full
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* KYC Documents */}
                                                            <div className="space-y-4">
                                                                <h3 className="font-semibold text-lg border-b pb-2">KYC Documents</h3>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    {seller.kycDetails?.panCard && (
                                                                        <div className="space-y-2">
                                                                            <p className="text-sm font-medium">PAN Card</p>
                                                                            <div className="border rounded-lg overflow-hidden h-48 bg-gray-50 flex items-center justify-center relative group">
                                                                                <img src={seller.kycDetails.panCard} alt="PAN Card" className="w-full h-full object-contain" />
                                                                                <a href={seller.kycDetails.panCard} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity">
                                                                                    View Full
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {seller.kycDetails?.addressProof && (
                                                                        <div className="space-y-2">
                                                                            <p className="text-sm font-medium">Address Proof</p>
                                                                            <div className="border rounded-lg overflow-hidden h-48 bg-gray-50 flex items-center justify-center relative group">
                                                                                <img src={seller.kycDetails.addressProof} alt="Address Proof" className="w-full h-full object-contain" />
                                                                                <a href={seller.kycDetails.addressProof} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity">
                                                                                    View Full
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {seller.kycDetails?.livePhoto && (
                                                                        <div className="space-y-2">
                                                                            <p className="text-sm font-medium">Live Photo</p>
                                                                            <div className="border rounded-lg overflow-hidden h-48 bg-gray-50 flex items-center justify-center relative group">
                                                                                <img src={seller.kycDetails.livePhoto} alt="Live Photo" className="w-full h-full object-contain" />
                                                                                <a href={seller.kycDetails.livePhoto} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity">
                                                                                    View Full
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <DialogFooter className="gap-2 sm:gap-0">
                                                                <Button variant="outline" onClick={() => handleVerify('rejected')} disabled={isProcessing} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                                    Reject Application
                                                                </Button>
                                                                <Button onClick={() => handleVerify('verified')} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
                                                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                                    Approve Application
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Sellers;
