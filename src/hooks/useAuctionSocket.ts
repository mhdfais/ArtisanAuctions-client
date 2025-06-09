import { socket } from "@/socket/socket";
import { useCallback, useEffect, useRef } from "react";

interface BidEvent {
  artworkId: string;
  bidderId: string;
  bidderName: string; // Added to match IBid interface
  bidAmount: number;
  timestamp: string;
}

interface AuctionEndedEvent {
  artworkId: string;
  winner: {
    bidderId: string;
    bidderName: string;
    amount: number;
  } | null;
}

interface UseAuctionSocketProps {
  artworkId: string;
  userId: string;
  onNewBid: (bid: BidEvent) => void;
  onAuctionEnded: (winner: AuctionEndedEvent["winner"]) => void;
}

export const useAuctionSocket = ({
  artworkId,
  userId,
  onNewBid,
  onAuctionEnded,
}: UseAuctionSocketProps) => {
  const socketRef = useRef(socket);

  // Function to place a bid
  const placeBid = useCallback(
    (bidAmount: number, callback: (error?: string) => void) => {
      socketRef.current.emit(
        "placeBid",
        { artworkId, userId, bidAmount },
        (response: { success: boolean; error?: string }) => {
          if (!response.success) {
            callback(response.error || "Failed to place bid");
          } else {
            callback(); // Bid placed successfully
          }
        }
      );
    },
    [artworkId, userId]
  );

  useEffect(() => {
    const s = socketRef.current;

    // Join auction room
    s.emit("joinAuction", { artworkId, userId });

    // Listen for new bids
    s.on("newBid", (bid: BidEvent) => {
      if (bid.artworkId === artworkId) {
        onNewBid(bid);
      }
    });

    // Listen for auction end
    s.on("auctionEnded", (event: AuctionEndedEvent) => {
      if (event.artworkId === artworkId) {
        onAuctionEnded(event.winner);
      }
    });

    // Listen for errors
    s.on("error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
    });

    // Cleanup on unmount
    return () => {
      s.emit("leaveAuction", { artworkId, userId });
      s.off("newBid");
      s.off("auctionEnded");
      s.off("error");
    };
  }, [artworkId, userId, onNewBid, onAuctionEnded]);

  return { placeBid };
};