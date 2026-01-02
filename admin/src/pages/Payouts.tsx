
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Payout {
  _id: string;
  sellerId: {
    _id: string;
    storeName: string;
    walletBalance: number;
    bankDetails: {
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
    };
    user: {
      firstName: string;
      lastName: string;
      email: string;
      mobile: string;
    }
  };
  amount: number;
  status: 'Pending' | 'Processing' | 'Paid' | 'Failed' | 'Rejected';
  requestDate: string;
  processedAt?: string;
  transactionId?: string;
  notes?: string;
}

const Payouts = () => {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // For update dialog
    const [transactionId, setTransactionId] = useState('');
    const [notes, setNotes] = useState('');
    const [actionStatus, setActionStatus] = useState<string>('');

    const fetchPayouts = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return;
            const response = await adminAPI.payouts.getAll(token);
            if (response.success) {
                setPayouts(response.data);
            }
        } catch (error) {
            toast({
                title: "Error fetching payouts",
                description: "Failed to load payout requests",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, []);

    const handleUpdateStatus = async () => {
        if (!selectedPayout || !actionStatus) return;
        setIsProcessing(true);
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return;

            await adminAPI.payouts.updateStatus(selectedPayout._id, {
                status: actionStatus,
                transactionId,
                notes
            }, token);

            toast({
                title: "Payout Updated",
                description: `Payout marked as ${actionStatus}.`,
            });
            
            fetchPayouts();
            // Close dialog logic? We rely on it naturally closing or user closing it.
            // But since we use state for inputs, we should probably reset them.
            setTransactionId('');
            setNotes('');
            setActionStatus('');
            setSelectedPayout(null);

        } catch (error) {
             toast({
                title: "Update failed",
                description: "Failed to update payout status.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        if (status === 'Paid') variant = "default"; // green usually
        if (status === 'Processing') variant = "secondary"; // yellow/gray
        if (status === 'Failed' || status === 'Rejected') variant = "destructive";
        if (status === 'Pending') variant = "secondary"; // or outline

        // Override colors manually via class if needed, but badge variants are limited.
        return <Badge variant={variant}>{status}</Badge>
    };

    if (isLoading) {
        return (
             <div className="min-h-screen bg-background py-8 flex justify-center items-center">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
        );
    }

    return (
        <>
            <FloatingDock />
            <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">Payout Requests</h2>
                        <p className="text-muted-foreground">Manage seller withdrawal requests</p>
                    </div>

                    <Card className="glass border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle>All Requests ({payouts.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {payouts.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No payout requests found.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Store</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payouts.map((payout) => (
                                            <TableRow key={payout._id}>
                                                <TableCell>
                                                    <div className="font-medium">{payout.sellerId?.storeName || 'Unknown Seller'}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {payout.sellerId?.user?.firstName} {payout.sellerId?.user?.lastName}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold">
                                                    ₹{payout.amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(payout.requestDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={payout.status} />
                                                </TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" onClick={() => {
                                                                setSelectedPayout(payout);
                                                                setTransactionId(payout.transactionId || '');
                                                                setNotes(payout.notes || '');
                                                                setActionStatus(''); 
                                                            }}>
                                                                Manage
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Update Payout Status</DialogTitle>
                                                                <DialogDescription>
                                                                    Review bank details and update status for <b>{payout.sellerId?.storeName}</b>
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            
                                                            <div className="py-4 space-y-4">
                                                                <div className="bg-muted p-3 rounded-md text-sm space-y-1">
                                                                    <p><b>Amount:</b> ₹{payout.amount.toLocaleString()}</p>
                                                                    <p><b>Bank:</b> {payout.sellerId?.bankDetails?.accountHolderName} | {payout.sellerId?.bankDetails?.accountNumber}</p>
                                                                    <p><b>IFSC:</b> {payout.sellerId?.bankDetails?.ifscCode}</p>
                                                                    <p><b>Current Status:</b> {payout.status}</p>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label>Action</Label>
                                                                    <select 
                                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                        value={actionStatus}
                                                                        onChange={(e) => setActionStatus(e.target.value)}
                                                                    >
                                                                        <option value="">Select Action...</option>
                                                                        {(payout.status === 'Processing' || payout.status === 'Pending') && (
                                                                            <>
                                                                                 <option value="Paid">Mark as Paid</option>
                                                                                 <option value="Failed">Mark as Failed</option>
                                                                                 <option value="Rejected">Reject Request</option>
                                                                            </>
                                                                        )}
                                                                        {(payout.status === 'Paid' || payout.status === 'Failed' || payout.status === 'Rejected') && (
                                                                             <option value="" disabled>No further actions</option>
                                                                        )}
                                                                    </select>
                                                                </div>

                                                                {actionStatus === 'Paid' && (
                                                                    <div className="space-y-2">
                                                                        <Label>Transaction ID</Label>
                                                                        <Input 
                                                                            placeholder="Enter bank transaction reference" 
                                                                            value={transactionId}
                                                                            onChange={(e) => setTransactionId(e.target.value)}
                                                                        />
                                                                    </div>
                                                                )}

                                                                <div className="space-y-2">
                                                                    <Label>Notes (Optional)</Label>
                                                                    <Textarea 
                                                                        placeholder="Any comments for the seller..."
                                                                        value={notes}
                                                                        onChange={(e) => setNotes(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <DialogFooter>
                                                                <Button 
                                                                    onClick={handleUpdateStatus} 
                                                                    disabled={isProcessing || !actionStatus}
                                                                >
                                                                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                    Update Status
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

export default Payouts;
