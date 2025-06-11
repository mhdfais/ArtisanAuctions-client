import { socket } from "@/socket/socket";
import { useCallback, useEffect, useRef } from "react";

interface BidEvent {
  artworkId: string;
  bidderId: string;
  bidderName: string;
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
  email: string;
  onNewBid: (bid: BidEvent) => void;
  onAuctionEnded: (winner: AuctionEndedEvent["winner"]) => void;
}

export const useAuctionSocket = ({
  artworkId,
  email,
  onNewBid,
  onAuctionEnded,
}: UseAuctionSocketProps) => {
  const socketRef = useRef(socket);

  const placeBid = useCallback(
    (bidAmount: number, callback: (error?: string) => void) => {
      if (!email) {
        callback("User not authenticated");
        return;
      }
      socketRef.current.emit(
        "placeBid",
        { artworkId, email, bidAmount },
        (response: { success: boolean; error?: string }) => {
          if (!response.success) {
            callback(response.error || "Failed to place bid");
          } else {
            callback();
          }
        }
      );
    },
    [artworkId, email]
  );

  useEffect(() => {
    if (!email || !artworkId) return;

    const s = socketRef.current;

    s.emit("joinAuction", { artworkId, email });

    s.on("newBid", (bid: BidEvent) => {
      if (bid.artworkId === artworkId) {
        onNewBid(bid);
      }
    });

    s.on("auctionEnded", (event: AuctionEndedEvent) => {
      if (event.artworkId === artworkId) {
        onAuctionEnded(event.winner);
      }
    });

    s.on("error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
    });

    return () => {
      s.emit("leaveAuction", { artworkId, email });
      s.off("newBid");
      s.off("auctionEnded");
      s.off("error");
    };
  }, [artworkId, email, onNewBid, onAuctionEnded]);

  return { placeBid };
};