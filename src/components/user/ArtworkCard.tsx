import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface IArtwork {
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
}

interface ArtworkCardProps {
  details: IArtwork;
  onClick:()=>void
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ details,onClick }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  const getTimeLeft = (start: string, end: string) => {
    const now = Date.now();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (now < startTime) return "Auction starts soon";
    if (now >= endTime) return "Ended";

    const diff = endTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const update = () => {
      if (details.auctionStartTime && details.auctionEndTime) {
        const result = getTimeLeft(details.auctionStartTime, details.auctionEndTime);
        setTimeLeft(result);
      }
    };

    update(); 

    const interval =
      details.auctionStartTime &&
      details.auctionEndTime &&
      new Date(details.auctionStartTime).getTime() <= Date.now() &&
      new Date(details.auctionEndTime).getTime() > Date.now()
        ? setInterval(update, 1000)
        : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [details.auctionStartTime, details.auctionEndTime]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#D6A85F]/20 group hover:-translate-y-1" onClick={onClick}>
      <div className="h-60 md:h-55 bg-gray-200 relative overflow-hidden">
        <img
          src={details.images?.[0]}
          alt="Artwork"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 right-3 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
          {timeLeft === "Ended" ? "Ended" : "Live"}
        </div>
      </div>

      <CardContent className="px-4 py-4 md:px-4 md:py-3 bg-gradient-to-br from-white to-amber-50/30">
        <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800">
          {details.title}
        </h3>

        <div className="flex justify-between items-center mb-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 md:p-2 rounded-lg border border-[#D6A85F]/20">
            <p className="text-sm text-gray-600 font-medium">Current Bid</p>
            <p className="text-xl md:text-lg font-bold text-[#D6A85F]">
              {details.highestBid === 0
                ? details.reservePrice
                : details.highestBid}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 font-medium">Time Left</p>
            <p className="font-semibold text-gray-800">{timeLeft}</p>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white py-3 md:py-2 rounded-lg hover:from-[#C19A56] hover:to-[#D6A85F] transition-all duration-200 font-medium shadow-md hover:shadow-lg">
          View details
        </button>
      </CardContent>
    </Card>
  );
};

export default ArtworkCard;
