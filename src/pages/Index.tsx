import { useState } from "react";
import RequisitionsPage from "./RequisitionsPage";
import { Requisition, User } from "@/types/requisition";

const Index = () => {
  // Sample current user - you can change this to test different roles
  const [currentUser] = useState<User>({
    name: "John Doe",
    role: "InventoryStaff" // Change to "Admin" or "Disbursements" to test other roles
  });

  // Sample requisitions data
  const [requisitions, setRequisitions] = useState<Requisition[]>([
    {
      id: "REQ-2024-001",
      department: "IT",
      supplierName: "Tech Solutions Ltd",
      requestedBy: "Alice Johnson",
      requestDate: "2024-01-15",
      totalAmount: 45000,
      status: "Pending Approval",
      items: [
        {
          id: "item-1",
          name: "Laptop Dell XPS 13",
          quantity: 2,
          unitPrice: 20000,
          totalPrice: 40000,
          description: "High-performance laptops for development team"
        },
        {
          id: "item-2", 
          name: "Wireless Mouse",
          quantity: 2,
          unitPrice: 2500,
          totalPrice: 5000,
          description: "Ergonomic wireless mice"
        }
      ],
      notes: "Urgent requirement for new developers",
      stockVerified: false,
      receiptUploaded: false
    },
    {
      id: "REQ-2024-002",
      department: "HR",
      supplierName: "Office Supplies Co",
      requestedBy: "Bob Smith",
      requestDate: "2024-01-14",
      totalAmount: 15000,
      status: "Approved",
      items: [
        {
          id: "item-3",
          name: "Office Chairs",
          quantity: 5,
          unitPrice: 3000,
          totalPrice: 15000,
          description: "Ergonomic office chairs for new hires"
        }
      ],
      stockVerified: false,
      receiptUploaded: false,
      approvedBy: "Jane Manager",
      approvedDate: "2024-01-16"
    },
    {
      id: "REQ-2024-003",
      department: "Finance",
      supplierName: "Stationery Plus",
      requestedBy: "Carol Davis",
      requestDate: "2024-01-13",
      totalAmount: 8500,
      status: "Paid",
      items: [
        {
          id: "item-4",
          name: "Printer Paper A4",
          quantity: 20,
          unitPrice: 300,
          totalPrice: 6000,
          description: "High-quality printing paper"
        },
        {
          id: "item-5",
          name: "Printer Cartridges",
          quantity: 5,
          unitPrice: 500,
          totalPrice: 2500,
          description: "Black and color cartridges"
        }
      ],
      stockVerified: false,
      receiptUploaded: false,
      approvedBy: "Jane Manager",
      approvedDate: "2024-01-14",
      paidBy: "Finance Team",
      paidDate: "2024-01-17"
    },
    {
      id: "REQ-2024-004",
      department: "Marketing",
      supplierName: "Print Masters",
      requestedBy: "David Wilson",
      requestDate: "2024-01-12",
      totalAmount: 25000,
      status: "Awaiting Receipt",
      items: [
        {
          id: "item-6",
          name: "Marketing Brochures",
          quantity: 1000,
          unitPrice: 25,
          totalPrice: 25000,
          description: "Full-color marketing brochures"
        }
      ],
      notes: "Required for upcoming trade show",
      stockVerified: true,
      receiptUploaded: false,
      approvedBy: "Jane Manager",
      approvedDate: "2024-01-13",
      paidBy: "Finance Team",
      paidDate: "2024-01-16"
    },
    {
      id: "REQ-2024-005",
      department: "Operations",
      supplierName: "Safety First Co",
      requestedBy: "Eva Brown",
      requestDate: "2024-01-11",
      totalAmount: 12000,
      status: "Completed",
      items: [
        {
          id: "item-7",
          name: "Safety Helmets",
          quantity: 10,
          unitPrice: 800,
          totalPrice: 8000,
          description: "Industrial safety helmets"
        },
        {
          id: "item-8",
          name: "Safety Vests",
          quantity: 10,
          unitPrice: 400,
          totalPrice: 4000,
          description: "High-visibility safety vests"
        }
      ],
      stockVerified: true,
      receiptUploaded: true,
      receiptUrl: "sample-receipt.pdf",
      approvedBy: "Jane Manager",
      approvedDate: "2024-01-12",
      paidBy: "Finance Team",
      paidDate: "2024-01-15"
    }
  ]);

  const handleRequisitionsUpdate = (updatedRequisitions: Requisition[]) => {
    setRequisitions(updatedRequisitions);
  };

  const handleRequisitionAdded = (newRequisition: Requisition) => {
    setRequisitions(prev => [newRequisition, ...prev]);
  };

  return (
    <RequisitionsPage
      currentUser={currentUser}
      requisitions={requisitions}
      onUpdate={handleRequisitionsUpdate}
      onRequisitionAdded={handleRequisitionAdded}
    />
  );
};

export default Index;
