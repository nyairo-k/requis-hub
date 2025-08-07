import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/badge-status";
import { FileText, Calendar, User, Building, DollarSign, Package, Upload, CheckCircle, Eye } from "lucide-react";
import { Requisition, User as UserType } from "@/types/requisition";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RequisitionCardProps {
  requisition: Requisition;
  currentUser: UserType;
  onUpdate: (updatedRequisition: Requisition) => void;
}

export function RequisitionCard({ requisition, currentUser, onUpdate }: RequisitionCardProps) {
  const [notes, setNotes] = useState(requisition.notes || '');
  const [showItems, setShowItems] = useState(false);
  const { toast } = useToast();

  const canApprove = currentUser.role === 'Admin' && requisition.status === 'Pending Approval';
  const canMarkPaid = currentUser.role === 'Disbursements' && requisition.status === 'Approved';
  const canVerifyStock = currentUser.role === 'InventoryStaff' && requisition.status === 'Paid';
  const canUploadReceipt = currentUser.role === 'InventoryStaff' && requisition.status === 'Awaiting Receipt';

  const handleApprove = () => {
    const updated = {
      ...requisition,
      status: 'Approved' as const,
      approvedBy: currentUser.name,
      approvedDate: new Date().toISOString().split('T')[0]
    };
    onUpdate(updated);
    toast({
      title: "Success",
      description: "Requisition approved successfully",
    });
  };

  const handleMarkPaid = () => {
    const updated = {
      ...requisition,
      status: 'Paid' as const,
      paidBy: currentUser.name,
      paidDate: new Date().toISOString().split('T')[0]
    };
    onUpdate(updated);
    toast({
      title: "Success",
      description: "Requisition marked as paid",
    });
  };

  const handleVerifyStock = () => {
    const updated = {
      ...requisition,
      status: 'Awaiting Receipt' as const,
      stockVerified: true
    };
    onUpdate(updated);
    toast({
      title: "Success",
      description: "Stock verified successfully",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload to a cloud service
      const updated = {
        ...requisition,
        status: 'Completed' as const,
        receiptUploaded: true,
        receiptUrl: URL.createObjectURL(file)
      };
      onUpdate(updated);
      toast({
        title: "Success",
        description: "Receipt uploaded successfully",
      });
    }
  };

  const handleNotesUpdate = () => {
    const updated = {
      ...requisition,
      notes: notes
    };
    onUpdate(updated);
    toast({
      title: "Success",
      description: "Notes updated successfully",
    });
  };

  return (
    <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-erp-primary" />
            {requisition.id}
          </CardTitle>
          <StatusBadge status={requisition.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Department:</span>
            <Badge variant="outline">{requisition.department}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Requested by:</span>
            <span>{requisition.requestedBy}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Date:</span>
            <span>{requisition.requestDate}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Total:</span>
            <span className="font-semibold text-erp-primary">Ksh {requisition.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Supplier:</span>
          <span>{requisition.supplierName}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog open={showItems} onOpenChange={setShowItems}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Items ({requisition.items.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Requisition Items - {requisition.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {requisition.items.map((item, index) => (
                  <Card key={item.id} className="border-border">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Item Name</Label>
                          <p className="text-sm">{item.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Quantity</Label>
                          <p className="text-sm">{item.quantity}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Unit Price</Label>
                          <p className="text-sm">Ksh {item.unitPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Total</Label>
                          <p className="text-sm font-semibold">Ksh {item.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      {item.description && (
                        <div className="mt-2">
                          <Label className="text-sm font-medium">Description</Label>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {canApprove && (
            <Button onClick={handleApprove} className="bg-erp-success hover:bg-erp-success/90 text-erp-success-foreground" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}

          {canMarkPaid && (
            <Button onClick={handleMarkPaid} className="bg-erp-info hover:bg-erp-info/90 text-erp-info-foreground" size="sm">
              <DollarSign className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}

          {canVerifyStock && (
            <Button onClick={handleVerifyStock} className="bg-status-verified hover:bg-status-verified/90 text-status-verified-foreground" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Verify Stock Received
            </Button>
          )}

          {canUploadReceipt && (
            <div>
              <input
                type="file"
                id={`receipt-${requisition.id}`}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={handleFileUpload}
              />
              <Button 
                onClick={() => document.getElementById(`receipt-${requisition.id}`)?.click()}
                className="bg-erp-primary hover:bg-erp-primary/90 text-erp-primary-foreground"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Receipt
              </Button>
            </div>
          )}

          {currentUser.role === 'InventoryStaff' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  {requisition.notes ? 'Edit Notes' : 'Add Notes'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notes - {requisition.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this requisition..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleNotesUpdate}>Save Notes</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {requisition.notes && (
          <div className="pt-2 border-t">
            <Label className="text-sm font-medium">Notes:</Label>
            <p className="text-sm text-muted-foreground mt-1">{requisition.notes}</p>
          </div>
        )}

        {/* Status-specific information */}
        {requisition.approvedBy && (
          <div className="text-xs text-muted-foreground">
            Approved by {requisition.approvedBy} on {requisition.approvedDate}
          </div>
        )}
        
        {requisition.paidBy && (
          <div className="text-xs text-muted-foreground">
            Paid by {requisition.paidBy} on {requisition.paidDate}
          </div>
        )}
      </CardContent>
    </Card>
  );
}