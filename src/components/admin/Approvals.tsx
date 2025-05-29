import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Image,
} from "lucide-react";
import { approve, reject, getApprovals } from "@/services/adminService";
import useToast from "@/hooks/useToast";
import Swal from "sweetalert2";

interface ApprovalRequests {
  _id: string;
  type: string;
  status: string;
  createdAt: string;
  requester?: {
    userId: string;
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
  };
  targetRef?: {
    address?: string;
    identificationNumber?: string;
  };
}

const AdminApprovals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("sellers");
  const [pendingRequests, setPendingRequests] = useState<ApprovalRequests[]>(
    []
  );
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const { error, success } = useToast();

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await getApprovals();
        // console.log(res.data)
        setPendingRequests(res.data);
      } catch (err) {
        error("Error", "Failed to fetch Approvals");
      }
    };
    fetchApprovals();
  }, []);

  const pendingSellers = pendingRequests
    .filter(
      (req) => req.type === "seller_application" && req.status === "pending"
    )
    .map((req) => ({
      _id: req._id,
      id: req.requester?.userId,
      type: req.type,
      name: req.requester?.name,
      email: req.requester?.email,
      status: req.status,
      applicationDate: req.createdAt,
      address: req.targetRef?.address,
      idNumber: req.targetRef?.identificationNumber,
      phone: req.requester?.phone,
      bio: req.requester?.bio,
    }));

  // console.log(pendingSellers);

  const pendingArtworks = [
    // {
    //   id: 1,
    //   type: 'artwork',
    //   title: 'Ocean Dreams',
    //   artist: 'Mike Chen',
    //   startingBid: '$500',
    //   status: 'pending',
    //   submissionDate: '2024-05-25',
    //   category: 'Abstract',
    //   medium: 'Oil on Canvas',
    //   dimensions: '24x36 inches',
    //   description: 'A beautiful abstract representation of ocean waves.',
    //   image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
    // },
    // {
    //   id: 2,
    //   type: 'artwork',
    //   title: 'City Nights',
    //   artist: 'Sarah Johnson',
    //   startingBid: '$750',
    //   status: 'pending',
    //   submissionDate: '2024-05-24',
    //   category: 'Urban',
    //   medium: 'Acrylic',
    //   dimensions: '30x40 inches',
    //   description: 'Vibrant depiction of city life at night.',
    //   image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&h=200&fit=crop'
    // }
  ];

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const handleApprove = async (approvalId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "The application will be approved.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D6A85F",
      cancelButtonColor: "#EAD7D1",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      backdrop: true,
    });
    if (result.isConfirmed) {
      setIsApproving(true);
      try {
        const res = await approve(approvalId);
        if (res.status === 200) {
          success("Success", "Seller approved");
          setPendingRequests((prev) =>
            prev.filter((req) => req._id !== approvalId)
          );
        }
      } catch (err) {
        error("Error", "Failed to approve");
      } finally {
        setIsApproving(false);
      }
    }
    // console.log(`Approving ${type}:`, itemId);
  };

  const handleReject = async (approvalId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "The application will be rejected",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D6A85F",
      cancelButtonColor: "#EAD7D1",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      backdrop: true,
    });
    if (result.isConfirmed) {
      setIsRejecting(true);
      try {
        const res = await reject(approvalId);
        if (res.status === 200) {
          success("Success", "Application rejected");
          setPendingRequests((prev) =>
            prev.filter((req) => req._id !== approvalId)
          );
        }
      } catch (err) {
        error("Error", "Failed to reject");
      } finally {
        setIsRejecting(false);
      }
    }
    // console.log(`Rejecting ${type}:`, itemId);
  };

  const getStatusBadge = (status: string) => {
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Approvals</h1>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {pendingSellers.length + pendingArtworks.length} Pending Items
          </Badge>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search approvals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-300 focus:border-amber-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sellers">
            Seller Applications ({pendingSellers.length})
          </TabsTrigger>
          <TabsTrigger value="artworks">
            Artwork Submissions ({pendingArtworks.length})
          </TabsTrigger>
        </TabsList>

        {/* Seller Applications */}
        <TabsContent value="sellers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingSellers.map((seller) => (
              <Card
                key={seller.id}
                className="bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">
                        {seller.name}
                      </h3>
                      <p className="text-slate-600">{seller.email}</p>
                    </div>
                    {getStatusBadge(seller.status)}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">
                          Application Date:
                        </span>
                        <p className="font-medium text-slate-800">
                          {new Date(
                            seller.applicationDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">ID Number:</span>
                        <p className="font-medium text-slate-800">
                          {seller.idNumber}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Address:</span>
                      <p className="font-medium text-slate-800">
                        {seller.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewDetails(seller)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(seller._id)}
                      disabled={isApproving}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {isApproving ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(seller._id)}
                      disabled={isRejecting}
                    >
                      <X className="h-4 w-4 mr-1" />
                      {isRejecting ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Artwork Submissions */}
        <TabsContent value="artworks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* {pendingArtworks.map((artwork) => (
              <Card
                key={artwork.id}
                className="bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(artwork.status)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-slate-800 text-lg mb-1">
                      {artwork.title}
                    </h3>
                    <p className="text-slate-600 mb-2">by {artwork.artist}</p>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Starting Bid:</span>
                        <span className="font-medium text-amber-600">
                          {artwork.startingBid}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Medium:</span>
                        <span className="font-medium text-slate-800">
                          {artwork.medium}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dimensions:</span>
                        <span className="font-medium text-slate-800">
                          {artwork.dimensions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Submitted:</span>
                        <span className="font-medium text-slate-800">
                          {new Date(
                            artwork.submissionDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewDetails(artwork)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(artwork.id, "artwork")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(artwork.id, "artwork")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))} */}
          </div>
        </TabsContent>
      </Tabs>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              {selectedItem?.type === "seller_application"
                ? "Seller"
                : "Artwork"}{" "}
              Details - {selectedItem?.name || selectedItem?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedItem && selectedItem.type === "seller_application" && (
            <div className="space-y-6">
              {/* Seller Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-amber-600" />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700 break-all w-0 flex-1">
                          {selectedItem?.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700 break-all w-0 flex-1">
                          {selectedItem.phone}
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                        <span className="text-slate-700 break-all w-0 flex-1">
                          {selectedItem.address}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                      Application Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500 text-sm">
                          ID Number:
                        </span>
                        <p className="font-medium text-slate-800">
                          {selectedItem.idNumber}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm">
                          Commission Rate:
                        </span>
                        <p className="font-medium text-slate-800">15%</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm">
                          Application Date:
                        </span>
                        <p className="font-medium text-slate-800">
                          {new Date(
                            selectedItem.applicationDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedItem.bio && (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Bio
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedItem.bio}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {selectedItem && selectedItem.type === "artwork" && (
            <div className="space-y-6">
              {/* Artwork Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      {selectedItem.title}
                    </h3>
                    <p className="text-slate-600">by {selectedItem.artist}</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 text-sm">
                        Starting Bid:
                      </span>
                      <p className="font-medium text-amber-600 text-lg">
                        {selectedItem.startingBid}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Category:</span>
                      <p className="font-medium text-slate-800">
                        {selectedItem.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Medium:</span>
                      <p className="font-medium text-slate-800">
                        {selectedItem.medium}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">
                        Dimensions:
                      </span>
                      <p className="font-medium text-slate-800">
                        {selectedItem.dimensions}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Submitted:</span>
                      <p className="font-medium text-slate-800">
                        {new Date(
                          selectedItem.submissionDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedItem.description && (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Description
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              className="bg-green-600 hover:bg-green-700 flex-1"
              onClick={() => {
                handleApprove(selectedItem._id);
                setIsDetailsOpen(false);
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              Approve{" "}
              {selectedItem?.type === "seller_application"
                ? "Seller"
                : "Artwork"}
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
              onClick={() => {
                handleReject(selectedItem._id);
                setIsDetailsOpen(false);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Reject{" "}
              {selectedItem?.type === "seller_application"
                ? "Application"
                : "Submission"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovals;
