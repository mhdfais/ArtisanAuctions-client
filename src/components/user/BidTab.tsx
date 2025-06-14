import { TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import useToast from "@/hooks/useToast";
import { getBids } from "@/services/userService";
import { format } from "date-fns";

interface IBid {
  _id: string;
  artworkId: {
    _id: string;
    title: string;
    artistName?: string;
    images: string[];
    auctionEndTime?: Date;
    highestBid?: number;
    highestBidderId?: string;
    isEnded: boolean;
  };
  amount: number;
  placedAt: Date;
  status?: "active" | "outbid" | "won";
}

const BidTab = () => {
  const [bids, setBids] = useState<IBid[]>([]);
  const [loading, setLoading] = useState(false);
  const { error } = useToast();

  useEffect(() => {
    const fetchBids = async () => {
      setLoading(true);
      try {
        const res = await getBids();
        const processedBids = res.data.bidData.map((bid: IBid) => {
          let status: "active" | "outbid" | "won" = "active";

          if (bid.artworkId.isEnded) {
            // ----- Only after auction ends can a bid be "won"
            status =
              bid.artworkId.highestBidderId?.toString() === bid._id.toString()
                ? "won"
                : "outbid";
          } else {
            // ----- During active auction, check if this bid has been outbid
            status =
              bid.artworkId.highestBidderId?.toString() !==
                bid._id.toString() && bid.artworkId.highestBid !== bid.amount
                ? "outbid"
                : "active";
          }

          return { ...bid, status };
        });
        setBids(processedBids);
      } catch (err) {
        error("Error", "failed load bids");
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return {
          className: "bg-emerald-100 text-emerald-700 border-emerald-200",
          label: "Active",
        };
      case "outbid":
        return {
          className: "bg-orange-100 text-orange-700 border-orange-200",
          label: "Outbid",
        };
      case "won":
        return {
          className: "bg-[#D6A85F]/20 text-[#D6A85F] border-[#D6A85F]/40",
          label: "Won",
        };
      default:
        return {
          className: "bg-gray-100 text-gray-700 border-gray-200",
          label: "Pending",
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <TabsContent value="bids">
      <Card className="shadow-xl border-[#D6A85F]/20 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
              Your Bids
            </h2>
            <p className="text-gray-600 text-md">
              Track your active and past bids on auctions.
            </p>
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6A85F]"></div>
              </div>
            ) : bids.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No bids found
              </div>
            ) : (
              bids.map((bid) => {
                const badge = getBadgeVariant(bid.status || "active");
                const isAuctionEnded = bid.artworkId.isEnded;
                const isHighestBidder =
                  bid.artworkId.highestBidderId?.toString() ===
                  bid._id.toString();

                return (
                  <div
                    key={bid._id}
                    className="border border-[#D6A85F]/30 rounded-xl p-6 bg-gradient-to-r from-white to-amber-50/50 shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-gray-800">
                          {bid.artworkId.title}
                        </h3>
                        <p className="text-gray-600">
                          {bid.artworkId.artistName || "Unknown artist"}
                        </p>
                      </div>
                      <Badge
                        className={`${
                          badge.className
                        } px-4 py-2 text-sm font-medium hover:${
                          badge.className.split(" ")[0]
                        }`}
                      >
                        {badge.label}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">
                        Your bid:{" "}
                        <span className="text-[#D6A85F] font-bold">
                          {formatCurrency(bid.amount)}
                        </span>
                      </span>
                      <span className="text-gray-600 font-medium">
                        {isAuctionEnded ? (
                          isHighestBidder ? (
                            <>
                              Winning bid:{" "}
                              <span className="text-green-600 font-bold">
                                {formatCurrency(
                                  bid.artworkId.highestBid || bid.amount
                                )}
                              </span>
                            </>
                          ) : (
                            <>
                              Sold for:{" "}
                              <span className="text-red-600 font-bold">
                                {formatCurrency(bid.artworkId.highestBid || 0)}
                              </span>
                            </>
                          )
                        ) : (
                          <>
                            Current highest:{" "}
                            <span
                              className={
                                isHighestBidder
                                  ? "text-green-600 font-bold"
                                  : "text-red-600 font-bold"
                              }
                            >
                              {formatCurrency(bid.artworkId.highestBid || 0)}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                    {bid.artworkId.auctionEndTime && (
                      <div className="mt-2 text-xs text-gray-500">
                        {isAuctionEnded
                          ? `Auction ended on ${format(
                              new Date(bid.artworkId.auctionEndTime),
                              "MMM dd, yyyy hh:mm a"
                            )}`
                          : `Auction ends on ${format(
                              new Date(bid.artworkId.auctionEndTime),
                              "MMM dd, yyyy hh:mm a"
                            )}`}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default BidTab;
