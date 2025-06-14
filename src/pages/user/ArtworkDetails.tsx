import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  Eye,
  Users,
  ZoomIn,
  History,
  Palette,
  Ruler,
  Calendar,
} from "lucide-react";
import { getArtworkById, getArtworkBidHistory } from "@/services/userService";
import useToast from "@/hooks/useToast";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { RootState } from "@/redux/store/store";
import { logout } from "@/redux/store/authSlice";
// import { RootState } from "@/store";

interface IArtworkDetails {
  _id: string;
  title: string;
  approvalStatus: "pending" | "rejected" | "approved";
  isActive: boolean;
  reservePrice: number;
  listedDate: string;
  highestBid: number;
  auctionStartTime: string;
  auctionEndTime: string;
  description: string;
  medium: string;
  dimensions: {
    height: string;
    width: string;
  };
  yearCreated: number;
  category: string;
  images: string[];
  isEnded: boolean;
}

interface IBid {
  _id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  createdAt: string;
}

const ArtworkDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<IArtworkDetails | null>(null);
  const [bidHistory, setBidHistory] = useState<IBid[]>([]);
  const [bidAmount, setBidAmount] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isBidding, setIsBidding] = useState(false);
  const { error, success } = useToast();

  // Get user data from Redux
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const email = user?.email || "";
  // const userName = user?.name || "";

  // WebSocket hook
  const { placeBid } = useAuctionSocket({
    artworkId: id || "",
    email,
    onNewBid: (bid) => {
      setBidHistory((prev) => [
        {
          _id: bid.timestamp,
          bidderId: bid.bidderId,
          bidderName: bid.bidderName,
          amount: bid.bidAmount,
          createdAt: bid.timestamp,
        },
        ...prev,
      ]);
      setArtwork((prev) =>
        prev ? { ...prev, highestBid: bid.bidAmount } : prev
      );
    },
    onAuctionEnded: (winner) => {
      setTimeLeft("Ended");
      if (winner) {
        success(
          "Auction Ended",
          `Winner: ${winner.bidderName} with ${formatCurrency(winner.amount)}`
        );
      } else {
        success("Auction Ended", "No winner for this auction");
      }
    },
  });

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;
      setLoading(true);
      // console.log(id)
      try {
        const [artworkResponse, bidHistoryResponse] = await Promise.all([
          getArtworkById(id),
          getArtworkBidHistory(id),
        ]);
        setArtwork(artworkResponse.data.details);
        setBidHistory(bidHistoryResponse.data.bids || []);
        // console.log(bidHistoryResponse.data.bids);
      } catch (err) {
        console.error("Error fetching artwork details:", err);
        setErr("Failed to load artwork details");
        error("Error", "Failed to load artwork details");
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  const handleBidSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isLoggedIn) {
    error("Error", "Please log in to place a bid");
    navigate("/login");
    return;
  }

  const amount = Number(bidAmount);
  const minBid = artwork ? artwork.highestBid + 50 : 0;
  if (!bidAmount || amount < minBid) {
    error("Error", `Bid must be at least ${formatCurrency(minBid)}`);
    return;
  }

  setIsBidding(true);

  placeBid(amount, (err) => {
    setIsBidding(false);

    if (err) {
      error("Error", err);
      if (
        err === "Authentication failed" ||
        err === "User not authenticated"
      ) {
        logout();
        navigate("/login");
      }
      return;
    }

    const tempBidId = new Date().getTime().toString();

    setBidHistory((prev) => [
      {
        _id: tempBidId,
        bidderId: user?._id || "",
        bidderName: user?.name || "",
        amount,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setArtwork((prev) => (prev ? { ...prev, highestBid: amount } : prev));

    success("Success", `Bid of ${formatCurrency(amount)} placed successfully`);
    setBidAmount("");
  });
};


  // const formatTimeLeft = (endTime: string) => {
  //   const now = new Date();
  //   const end = new Date(endTime);
  //   const diff = end.getTime() - now.getTime();
  //   if (diff <= 0) return "Ended";
  //   const hours = Math.floor(diff / (1000 * 60 * 60));
  //   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  //   return `${hours}h ${minutes}m`;
  // };

  const getTimeLeft = (end: string, start: string) => {
    const now = Date.now();
    const endTime = new Date(end).getTime();
    const startTime = new Date(start).getTime();
    if (isNaN(endTime)) return "Invalid date";
    if (now < startTime) return "Auction starts soon";
    if (now >= endTime) return "Ended";
    const diff = endTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const updateTimer = () => {
      if (artwork?.auctionEndTime) {
        const result = getTimeLeft(
          artwork.auctionEndTime,
          artwork.auctionStartTime
        );
        setTimeLeft(result);
      }
    };
    updateTimer();
    const interval =
      artwork?.auctionEndTime &&
      new Date(artwork.auctionEndTime).getTime() > Date.now()
        ? setInterval(updateTimer, 1000)
        : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [artwork?.auctionEndTime]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const img = e.currentTarget.querySelector("img") as HTMLImageElement;
    if (img) {
      img.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (err || !artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{err || "Artwork not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F6F1] via-[#FDF9F3] to-[#F5F0E8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
              className={isFavorited ? "text-red-500" : "text-slate-600"}
            >
              <Heart
                className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`}
              />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-2xl relative group">
              <div
                className="relative w-full h-96 lg:h-[500px] overflow-hidden cursor-zoom-in"
                onMouseMove={handleMouseMove}
              >
                <img
                  src={
                    artwork.images[selectedImage] || "/placeholder-image.jpg"
                  }
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-150"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <img
                      src={
                        artwork.images[selectedImage] ||
                        "/placeholder-image.jpg"
                      }
                      alt={artwork.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
            <div className="flex space-x-2">
              {artwork.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors group ${
                    selectedImage === index
                      ? "border-[#D6A85F]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-serif font-bold text-slate-800">
                  {artwork.title}
                </h1>
                {artwork.isEnded ? (
                  <Badge className="bg-red-100 text-red-800">Ended</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">
                    Live Auction
                  </Badge>
                )}
              </div>
              {/* <div className="flex items-center space-x-4 text-slate-600">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{artwork.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{artwork.watchers} watching</span>
                </div>
              </div> */}
            </div>

            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-[#D6A85F]/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-1">
                      Current Bid
                    </p>
                    <p className="text-3xl font-bold text-[#D6A85F]">
                      {formatCurrency(artwork.highestBid)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-slate-500">
                        {bidHistory.length} bids placed
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBidHistory(!showBidHistory)}
                        className="text-xs text-[#D6A85F] hover:text-[#C19A56] p-0 h-auto"
                      >
                        <History className="h-3 w-3 mr-1" />
                        View History
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium mb-1">
                      Time Left
                    </p>
                    <div className="flex items-center justify-end space-x-1">
                      <Clock className="h-4 w-4 text-red-500" />
                      <p className="text-xl font-bold text-slate-800">
                        {timeLeft}
                      </p>
                    </div>

                    <p className="text-sm text-slate-500">
                      Start At{" "}
                      {new Date(artwork.auctionStartTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      Ends{" "}
                      {new Date(artwork.auctionEndTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {showBidHistory && (
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Bid History
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBidHistory(false)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Close
                    </Button>
                  </div>

                  {bidHistory.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 font-medium px-2">
                        <div className="col-span-5">Bidder</div>
                        <div className="col-span-3 text-right">Amount</div>
                        <div className="col-span-4 text-right">Time</div>
                      </div>

                      <div className="max-h-96 overflow-y-auto pr-2">
                        {bidHistory.map((bid) => (
                          <div
                            key={bid._id}
                            className={`grid grid-cols-12 gap-2 items-center p-3 rounded-lg transition-colors ${
                              bid.amount === artwork.highestBid
                                ? "bg-green-50 border border-green-200"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <div className="col-span-5 font-medium text-slate-800 truncate">
                              {bid.bidderName}
                            </div>
                            <div className="col-span-3 text-right font-bold">
                              <span
                                className={
                                  bid.amount === artwork.highestBid
                                    ? "text-green-600"
                                    : "text-slate-700"
                                }
                              >
                                {formatCurrency(bid.amount)}
                              </span>
                            </div>
                            <div className="col-span-4 text-right text-sm text-slate-500">
                              {new Date(bid.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <History className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                      <p className="text-slate-500">
                        No bids have been placed yet
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        Be the first to place a bid!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Place Your Bid
                </h3>
                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder={
                          isLoggedIn
                            ? `Minimum: ${formatCurrency(
                                artwork.highestBid + 50
                              )}`
                            : "Log in to bid"
                        }
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="text-lg"
                        disabled={
                          !isLoggedIn ||
                          isBidding ||
                          timeLeft === "Ended" ||
                          !artwork.isActive ||
                          artwork.isEnded
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F] px-8"
                      disabled={
                        !isLoggedIn ||
                        isBidding ||
                        timeLeft === "Ended" ||
                        !artwork.isActive ||
                        artwork.isEnded
                      }
                    >
                      {isBidding ? "Placing Bid..." : "Place Bid"}
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500">
                    Starting bid was {formatCurrency(artwork.reservePrice)}
                  </p>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Artwork Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4 text-slate-500" />
                      <div>
                        <span className="text-slate-500">Medium:</span>
                        <p className="font-medium text-slate-800">
                          {artwork.medium}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ruler className="h-4 w-4 text-slate-500" />
                      <div>
                        <span className="text-slate-500">Dimensions:</span>
                        <p className="font-medium text-slate-800">{`${artwork.dimensions.height} x ${artwork.dimensions.width} cm`}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <div>
                        <span className="text-slate-500">Year:</span>
                        <p className="font-medium text-slate-800">
                          {artwork.yearCreated}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-500">Category:</span>
                      <p className="font-medium text-slate-800">
                        {artwork.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Condition:</span>
                      <p className="font-medium text-slate-800">N/A</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Provenance:</span>
                      <p className="font-medium text-slate-800">N/A</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-12 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                  Description
                </h3>
                <p className="text-slate-700 leading-relaxed text-lg">
                  {artwork.description}
                </p>
                <Separator className="my-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">
                      Additional Information
                    </h4>
                    <p className="text-slate-600">No certification provided</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">
                      Auction Details
                    </h4>
                    <p className="text-slate-600">
                      This auction will end on{" "}
                      {new Date(artwork.auctionEndTime).toLocaleDateString()} at{" "}
                      {new Date(artwork.auctionEndTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetails;
