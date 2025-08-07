import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw } from "lucide-react";
import { DashboardCards } from "@/components/requisitions/DashboardCards";
import { CreateRequisitionDialog } from "@/components/requisitions/CreateRequisitionDialog";
import { RequisitionCard } from "@/components/requisitions/RequisitionCard";
import { Requisition, RequisitionsPageProps } from "@/types/requisition";

export default function RequisitionsPage({ 
  currentUser, 
  requisitions, 
  onUpdate, 
  onRequisitionAdded 
}: RequisitionsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Get role-specific primary filter
  const getPrimaryFilter = () => {
    switch (currentUser.role) {
      case 'Admin':
        return 'Pending Approval';
      case 'Disbursements':
        return 'Approved';
      case 'InventoryStaff':
        return 'all';
      default:
        return 'all';
    }
  };

  const [primaryFilter, setPrimaryFilter] = useState(getPrimaryFilter());

  // Filter requisitions based on search and filters
  const filteredRequisitions = useMemo(() => {
    let filtered = [...requisitions];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Apply department filter (Admin specific)
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(req => req.department === departmentFilter);
    }

    // Apply primary filter for role-based views
    if (primaryFilter !== 'all') {
      filtered = filtered.filter(req => req.status === primaryFilter);
    }

    return filtered;
  }, [requisitions, searchTerm, statusFilter, departmentFilter, primaryFilter]);

  const handleRequisitionUpdate = (updatedRequisition: Requisition) => {
    const updatedRequisitions = requisitions.map(req => 
      req.id === updatedRequisition.id ? updatedRequisition : req
    );
    onUpdate(updatedRequisitions);
  };

  const departments = [...new Set(requisitions.map(req => req.department))];
  const statuses = ['Pending Approval', 'Approved', 'Paid', 'Awaiting Receipt', 'Completed'];

  // Role-specific primary filters
  const getPrimaryFilterOptions = () => {
    switch (currentUser.role) {
      case 'Admin':
        return [
          { value: 'all', label: 'All Requisitions' },
          { value: 'Pending Approval', label: 'Pending My Approval' }
        ];
      case 'Disbursements':
        return [
          { value: 'all', label: 'All Requisitions' },
          { value: 'Approved', label: 'Ready for Payment' }
        ];
      case 'InventoryStaff':
        return [
          { value: 'all', label: 'All Requisitions' },
          { value: 'Paid', label: 'Need Stock Verification' },
          { value: 'Awaiting Receipt', label: 'Need Receipt Upload' }
        ];
      default:
        return [{ value: 'all', label: 'All Requisitions' }];
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Requisitions</h1>
            <p className="text-muted-foreground">
              Welcome back, {currentUser.name} ({currentUser.role})
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {currentUser.role === 'InventoryStaff' && (
              <CreateRequisitionDialog 
                currentUser={currentUser}
                onRequisitionAdded={onRequisitionAdded}
              />
            )}
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <DashboardCards requisitions={requisitions} currentUser={currentUser} />

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search requisitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Primary role-based filter */}
            <Select value={primaryFilter} onValueChange={setPrimaryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getPrimaryFilterOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Department filter (Admin only) */}
            {currentUser.role === 'Admin' && (
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRequisitions.length} of {requisitions.length} requisitions
          </p>
        </div>

        {/* Requisitions Grid */}
        {filteredRequisitions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">No requisitions found</div>
            <p className="text-sm text-muted-foreground mt-2">
              {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' 
                ? 'Try adjusting your filters'
                : currentUser.role === 'InventoryStaff' 
                  ? 'Create your first requisition to get started'
                  : 'No requisitions available'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequisitions.map((requisition) => (
              <RequisitionCard
                key={requisition.id}
                requisition={requisition}
                currentUser={currentUser}
                onUpdate={handleRequisitionUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}