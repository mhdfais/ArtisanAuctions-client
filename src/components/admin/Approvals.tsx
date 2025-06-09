import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { approve, reject, getApprovals } from "@/services/adminService";
import useToast from "@/hooks/useToast";
import Swal from "sweetalert2";

interface ApprovalRequests {
  _id: string;
  type: "seller_application" | "artwork_submission";
  status: "pending" | "approved" | "rejected";
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
    reservePrice?: string;
    createdAt?: string;
    category?: string;
    medium?: string;
    dimensions?: {
      width?: string;
      height?: string;
    };
    description?: string;
    images: string[];
    title?: string;
  };
}

interface Seller {
  _id: string;
  id: string;
  type: "seller_application";
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  applicationDate: string;
  address: string;
  idNumber: string;
  phone: string;
  bio: string;
}

interface Artwork {
  _id: string;
  id: string;
  type: "artwork_submission";
  title: string;
  name: string;
  startingBid: string;
  createdAt: string;
  submissionDate: string;
  category: string;
  medium: string;
  width: string;
  height: string;
  description: string;
  images: string[];
  status: "pending" | "approved" | "rejected";
}

const AdminApprovals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Seller | Artwork | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"sellers" | "artworks">("sellers");
  const [pendingRequests, setPendingRequests] = useState<ApprovalRequests[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { error, success } = useToast();

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await getApprovals();
        console.log("API Response:", res.data); // Log to debug
        setPendingRequests(res.data || []);
      } catch (err: any) {
        error("Error", err.message || "Failed to fetch approvals");
      }
    };
    fetchApprovals();
  }, []);

  const pendingSellers: Seller[] = pendingRequests
    .filter((req): req is ApprovalRequests & { type: "seller_application" } => 
      req.type === "seller_application" && req.status === "pending"
    )
    .map((req) => ({
      _id: req._id,
      id: req.requester?.userId || "N/A",
      type: req.type,
      name: req.requester?.name || "Unknown",
      email: req.requester?.email || "N/A",
      status: req.status,
      applicationDate: req.createdAt,
      address: req.targetRef?.address || "N/A",
      idNumber: req.targetRef?.identificationNumber || "N/A",
      phone: req.requester?.phone || "N/A",
      bio: req.requester?.bio || "No bio provided",
    }));

  const pendingArtworks: Artwork[] = pendingRequests
    .filter((req): req is ApprovalRequests & { type: "artwork_submission" } => 
      req.type === "artwork_submission" && req.status === "pending"
    )
    .map((req) => ({
      _id: req._id,
      id: req.requester?.userId || "N/A",
      type: req.type,
      title: req.targetRef?.title || "Untitled",
      name: req.requester?.name || "Unknown",
      startingBid: req.targetRef?.reservePrice || "Not Set",
      createdAt: req.targetRef?.createdAt || req.createdAt,
      submissionDate: req.createdAt,
      category: req.targetRef?.category || "N/A",
      medium: req.targetRef?.medium || "N/A",
      width: req.targetRef?.dimensions?.width || "N/A",
      height: req.targetRef?.dimensions?.height || "N/A",
      description: req.targetRef?.description || "No description provided",
      images: req.targetRef?.images || [],
      status: req.status,
    }));

  const filteredSellers = pendingSellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArtworks = pendingArtworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (approvalId: string, type: string) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `The ${type} will be approved.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D6A85F",
      cancelButtonColor: "#EAD7D1",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsApproving(true);
      try {
        const res = await approve(approvalId);
        if (res.status === 200) {
          success("Success", `${type.charAt(0).toUpperCase() + type.slice(1)} approved`);
          setPendingRequests((prev) => prev.filter((req) => req._id !== approvalId));
        }
      } catch (err: any) {
        error("Error", `Failed to approve ${type}: ${err.message}`);
      } finally {
        setIsApproving(false);
      }
    }
  };

  const handleReject = async (approvalId: string, type: string) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `The ${type} will be rejected.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D6A85F",
      cancelButtonColor: "#EAD7D1",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsRejecting(true);
      try {
        const res = await reject(approvalId);
        if (res.status === 200) {
          success("Success", `${type.charAt(0).toUpperCase() + type.slice(1)} rejected`);
          setPendingRequests((prev) => prev.filter((req) => req._id !== approvalId));
        }
      } catch (err: any) {
        error("Error", `Failed to reject ${type}: ${err.message}`);
      } finally {
        setIsRejecting(false);
      }
    }
  };

  const handleViewDetails = (item: Seller | Artwork) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => (
    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
  );

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : (selectedItem as Artwork)?.images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < (selectedItem as Artwork)?.images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Approvals</h1>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          {filteredSellers.length + filteredArtworks.length} Pending Items
        </Badge>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search approvals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-300 focus:border-amber-500"
              aria-label="Search approvals"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "sellers" | "artworks")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sellers">
            Seller Applications ({filteredSellers.length})
          </TabsTrigger>
          <TabsTrigger value="artworks">
            Artwork Submissions ({filteredArtworks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sellers" className="space-y-6">
          {filteredSellers.length === 0 ? (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-slate-600 text-lg">No sellers found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSellers.map((seller) => (
                <Card key={seller._id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">{seller.name}</h3>
                        <p className="text-slate-600">{seller.email}</p>
                      </div>
                      {getStatusBadge(seller.status)}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Application Date:</span>
                          <p className="font-medium text-slate-800">
                            {new Date(seller.applicationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">ID Number:</span>
                          <p className="font-medium text-slate-800">{seller.idNumber}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm">Address:</span>
                        <p className="font-medium text-slate-800">{seller.address}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewDetails(seller)}
                        aria-label={`View details for ${seller.name}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(seller._id, "seller")}
                        disabled={isApproving}
                        aria-label={`Approve ${seller.name}`}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {isApproving ? "Approving..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(seller._id, "seller")}
                        disabled={isRejecting}
                        aria-label={`Reject ${seller.name}`}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {isRejecting ? "Rejecting..." : "Reject"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="artworks" className="space-y-6">
          {filteredArtworks.length === 0 ? (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-slate-600 text-lg">No artworks found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredArtworks.map((artwork) => (
                <Card key={artwork._id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={artwork.images[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={artwork.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 right-3">{getStatusBadge(artwork.status)}</div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-slate-800 text-lg mb-1">{artwork.title}</h3>
                      <p className="text-slate-600 mb-2">by {artwork.name}</p>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Starting Bid:</span>
                          <span className="font-medium text-amber-600">{artwork.startingBid}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Medium:</span>
                          <span className="font-medium text-slate-800">{artwork.medium}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Dimensions:</span>
                          <span className="font-medium text-slate-800">
                            {artwork.width} x {artwork.height}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Submitted:</span>
                          <span className="font-medium text-slate-800">
                            {new Date(artwork.submissionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewDetails(artwork)}
                          aria-label={`View details for ${artwork.title}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(artwork._id, "artwork")}
                          disabled={isApproving}
                          aria-label={`Approve ${artwork.title}`}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {isApproving ? "Approving..." : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(artwork._id, "artwork")}
                          disabled={isRejecting}
                          aria-label={`Reject ${artwork.title}`}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {isRejecting ? "Rejecting..." : "Reject"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              {selectedItem?.type === "seller_application"
                ? `Seller Details - ${selectedItem?.name || "N/A"}`
                : `Artwork Details - ${selectedItem?.title || "N/A"}`}
            </DialogTitle>
          </DialogHeader>

          {selectedItem?.type === "seller_application" && (
            <div className="space-y-6">
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
                        <span className="text-slate-700 break-all w-0 flex-1">{selectedItem.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700 break-all w-0 flex-1">{selectedItem.phone}</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                        <span className="text-slate-700 break-all w-0 flex-1">{selectedItem.address}</span>
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
                        <span className="text-slate-500 text-sm">ID Number:</span>
                        <p className="font-medium text-slate-800">{selectedItem.idNumber}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm">Commission Rate:</span>
                        <p className="font-medium text-slate-800">15%</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm">Application Date:</span>
                        <p className="font-medium text-slate-800">
                          {new Date(selectedItem.applicationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedItem.bio && (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Bio</h4>
                    <p className="text-slate-700 leading-relaxed">{selectedItem.bio}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {selectedItem?.type === "artwork_submission" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <img
                    src={selectedItem.images[currentImageIndex] || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={`${selectedItem.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {selectedItem.images.length > 1 && (
                    <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 transform -translate-y-1/2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevImage}
                        className="bg-white/80 hover:bg-white"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextImage}
                        className="bg-white/80 hover:bg-white"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {selectedItem.images.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-white bg-black/50 py-1">
                      Image {currentImageIndex + 1} of {selectedItem.images.length}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{selectedItem.title}</h3>
                    <p className="text-slate-600">by {selectedItem.name}</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 text-sm">Starting Bid:</span>
                      <p className="font-medium text-amber-600 text-lg">{selectedItem.startingBid}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Category:</span>
                      <p className="font-medium text-slate-800">{selectedItem.category}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Medium:</span>
                      <p className="font-medium text-slate-800">{selectedItem.medium}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Dimensions:</span>
                      <p className="font-medium text-slate-800">
                        {selectedItem.width} x {selectedItem.height}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Submitted:</span>
                      <p className="font-medium text-slate-800">
                        {new Date(selectedItem.submissionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedItem.description && (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Description</h4>
                    <p className="text-slate-700 leading-relaxed">{selectedItem.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t">
            <Button
              className="bg-green-600 hover:bg-green-700 flex-1"
              onClick={() => {
                handleApprove(selectedItem!._id, selectedItem!.type === "seller_application" ? "seller" : "artwork");
                setIsDetailsOpen(false);
              }}
              disabled={isApproving}
              aria-label={`Approve ${selectedItem?.type === "seller_application" ? selectedItem?.name : selectedItem?.title || "N/A"}`}
            >
              <Check className="h-4 w-4 mr-2" />
              Approve {selectedItem?.type === "seller_application" ? "Seller" : "Artwork"}
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
              onClick={() => {
                handleReject(selectedItem!._id, selectedItem!.type === "seller_application" ? "seller" : "artwork");
                setIsDetailsOpen(false);
              }}
              disabled={isRejecting}
              aria-label={`Reject ${selectedItem?.type === "seller_application" ? selectedItem?.name : selectedItem?.title || "N/A"}`}
            >
              <X className="h-4 w-4 mr-2" />
              Reject {selectedItem?.type === "seller_application" ? "Application" : "Submission"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovals;