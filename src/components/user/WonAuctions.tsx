import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  DollarSign,
  Package,
  Eye,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useToast from "@/hooks/useToast";
import { getWonAuctions, updateAddress } from "@/services/userService";
import AddressModal, { AddressData } from "../modals/AddressModal";

interface IWonAuction {
  id: string;
  amount: number;
  artworkId: string;
  auctionEndTime: string;
  title: string;
  address: object;
  image: string;
  status: string;
  receipt:string
}

const WonAuctionsTab = () => {
  const [wonAuctions, setWonAuctions] = useState<IWonAuction[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  const { error, success } = useToast();

  // ----- get won auctions
  const fetchWonAuctions = async () => {
    try {
      const res = await getWonAuctions();
      setWonAuctions(res.data.wonAuctions);
      // console.log(res.data.wonAuctions);
    } catch (err) {
      error("Error", "Failed to load won auctions");
    }
  };

  useEffect(() => {
    fetchWonAuctions();
  }, []);

 

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  // const getActionButton = (auction: IWonAuction) => {
  //   switch (auction.status) {
  //     case "pending":
  //       return {
  //         text: "Complete Payment",
  //         variant: "default" as const,
  //         urgent: true,
  //       };
  //     case "shipped":
  //       return {
  //         text: "Track Package",
  //         variant: "outline" as const,
  //         urgent: false,
  //       };
  //     case "delivered":
  //       return {
  //         text: "View Details",
  //         variant: "outline" as const,
  //         urgent: false,
  //       };
  //   }
  // };

  // const handleManageAuction = (artworkId: string) => {
  //   navigate(`/post-auction/${artworkId}`);
  // };

  const handleViewArtwork = (artworkId: string) => {
    navigate(`/artwork/${artworkId}`);
  };

  // ----- separating auctions
  const urgentAuctions = wonAuctions.filter(
    (auction) => Object.keys(auction.address).length === 0
  );
  const inProgressAuctions = wonAuctions.filter(
    (auction) =>
      Object.keys(auction.address).length !== 0 && auction.status === "pending"
  );
  const completedAuctions = wonAuctions.filter(auction =>
    ['delivered', 'shipped'].includes(auction.status)
  );

  // ----- handling address modal
  const handleAddressModal = (wonAuctionId: string) => {
    setSelectedAuctionId(wonAuctionId);
    setModalOpen(true);
  };

  // ----- saving address 
  const handleSaveAddress = async (address: AddressData) => {
    if (!selectedAuctionId) return;
    try {
      await updateAddress(selectedAuctionId, address);
      fetchWonAuctions();
      success("Success", "Address updated");
    } catch (err) {
      error("Error", "Failed to save address");
    }
  };

  return (
    <TabsContent value="won-auctions">
      <div className="space-y-8">
        {/* Urgent Actions */}
        {urgentAuctions.length > 0 && (
          <Card className="shadow-xl border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl font-serif text-red-800">
                <Clock className="h-6 w-6 text-red-600" />
                <span>Urgent - Address Required</span>
                <Badge className="bg-red-100 text-red-800">
                  {urgentAuctions.length}
                </Badge>
              </CardTitle>
              <p className="text-red-700">
                Complete shipping details to secure your won artworks.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {urgentAuctions.map((auction) => (
                <div
                  key={auction.artworkId}
                  className="border rounded-lg p-4 bg-white border-red-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-red-300"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">
                        {auction.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-green-600">
                            {formatCurrency(auction.amount)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Won: {formatDate(auction.auctionEndTime)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleAddressModal(auction.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Set shipping details
                        </Button>
                        <AddressModal
                          onClose={() => setModalOpen(false)}
                          open={modalOpen}
                          onSave={handleSaveAddress}
                        />
                        <Button
                          onClick={() =>window.open(auction.receipt)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* In Progress */}
        {inProgressAuctions.length > 0 && (
          <Card className="shadow-xl border-[#D6A85F]/20 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl font-serif text-gray-800">
                <Package className="h-6 w-6 text-blue-500" />
                <span>In Progress</span>
                <Badge className="bg-blue-100 text-blue-800">{inProgressAuctions.length}</Badge>
              </CardTitle>
              <p className="text-slate-600">Your orders are being processed and shipped.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {inProgressAuctions.map((auction) => {
                return (
                  <div key={auction.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={auction.image} 
                        alt={auction.title}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-blue-300"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">{auction.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-bold text-blue-600">{formatCurrency(auction.amount)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Won: {formatDate(auction.auctionEndTime)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge className={`${getStatusColor(auction.status)} flex items-center space-x-1`}>
                            {getStatusIcon(auction.status)}
                            <span>{auction.status.replace('_', ' ').toUpperCase()}</span>
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          {/* <Button
                            onClick={() => handleManageAuction(auction.artworkId)}
                            variant={actionButton.variant}
                            className={actionButton.variant === 'default' ? 
                              "bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F]" : 
                              "border-blue-300 text-blue-600 hover:bg-blue-50"
                            }
                          >
                            {actionButton.text}
                          </Button> */}
                          <Button
                            onClick={() => handleViewArtwork(auction.artworkId)}
                            variant="outline"
                            size="sm"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                          onClick={() =>window.open(auction.receipt)}
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View receipt
                        </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Completed */}
        {completedAuctions.length > 0 && (
          <Card className="shadow-xl border-[#D6A85F]/20 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl font-serif text-gray-800">
                <Trophy className="h-6 w-6 text-green-500" />
                <span>Completed Orders</span>
                <Badge className="bg-green-100 text-green-800">{completedAuctions.length}</Badge>
              </CardTitle>
              <p className="text-slate-600">Successfully delivered artworks.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedAuctions.map((auction) => (
                <div key={auction.id} className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={auction.image} 
                      alt={auction.title}
                      className="w-16 h-16 object-cover rounded-lg border-2 border-green-300"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">{auction.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-bold text-green-600">{formatCurrency(auction.amount)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Won: {formatDate(auction.auctionEndTime)}</span>
                        </div>
                        <Badge className={`${getStatusColor(auction.status)} flex items-center space-x-1`}>
                          {getStatusIcon(auction.status)}
                          <span>DELIVERED</span>
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleViewArtwork(auction.artworkId)}
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-600 hover:bg-green-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                          onClick={() =>window.open(auction.receipt)}
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View receipt
                        </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {wonAuctions.length === 0 && (
          <Card className="shadow-xl border-[#D6A85F]/20 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Trophy className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No Won Auctions Yet
              </h3>
              <p className="text-slate-500 mb-6">
                Win some auctions to see your orders here.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F]"
              >
                Browse Artworks
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </TabsContent>
  );
};

export default WonAuctionsTab;
