import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, DollarSign, FileText, Package, AlertCircle } from "lucide-react";
import { Requisition, User } from "@/types/requisition";
import { cn } from "@/lib/utils";

interface DashboardCardsProps {
  requisitions: Requisition[];
  currentUser: User;
}

export function DashboardCards({ requisitions, currentUser }: DashboardCardsProps) {
  const getMetrics = () => {
    const pending = requisitions.filter(r => r.status === 'Pending Approval').length;
    const approved = requisitions.filter(r => r.status === 'Approved').length;
    const paid = requisitions.filter(r => r.status === 'Paid').length;
    const awaitingReceipt = requisitions.filter(r => r.status === 'Awaiting Receipt').length;
    const completed = requisitions.filter(r => r.status === 'Completed').length;
    const totalValue = requisitions.reduce((sum, r) => sum + r.totalAmount, 0);

    return { pending, approved, paid, awaitingReceipt, completed, totalValue };
  };

  const metrics = getMetrics();

  const cards = [
    {
      title: "Pending Approval",
      value: metrics.pending,
      icon: Clock,
      gradient: "bg-gradient-to-br from-status-pending to-status-pending/80",
      textColor: "text-status-pending-foreground",
      show: true
    },
    {
      title: "Approved",
      value: metrics.approved,
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-status-approved to-status-approved/80",
      textColor: "text-status-approved-foreground",
      show: true
    },
    {
      title: "Paid",
      value: metrics.paid,
      icon: DollarSign,
      gradient: "bg-gradient-to-br from-status-paid to-status-paid/80",
      textColor: "text-status-paid-foreground",
      show: true
    },
    {
      title: "Awaiting Receipt",
      value: metrics.awaitingReceipt,
      icon: Package,
      gradient: "bg-gradient-to-br from-status-verified to-status-verified/80",
      textColor: "text-status-verified-foreground",
      show: currentUser.role === 'InventoryStaff'
    },
    {
      title: "Completed",
      value: metrics.completed,
      icon: FileText,
      gradient: "bg-gradient-to-br from-status-completed to-status-completed/80",
      textColor: "text-status-completed-foreground",
      show: true
    },
    {
      title: "Total Value",
      value: `Ksh ${metrics.totalValue.toLocaleString()}`,
      icon: AlertCircle,
      gradient: "bg-gradient-to-br from-erp-primary to-erp-primary/80",
      textColor: "text-erp-primary-foreground",
      show: currentUser.role === 'Admin' || currentUser.role === 'Disbursements'
    }
  ];

  const visibleCards = cards.filter(card => card.show);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {visibleCards.map((card, index) => (
        <Card key={index} className="overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200">
          <CardHeader className={cn("pb-2", card.gradient)}>
            <CardTitle className={cn("text-sm font-medium flex items-center gap-2", card.textColor)}>
              <card.icon className="h-4 w-4" />
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-foreground">
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}