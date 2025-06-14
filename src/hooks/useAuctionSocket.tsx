// src/hooks/useAuctionSocket.ts
import { logout } from "@/redux/store/authSlice";
import { socket } from "@/socket/socket";
import { refreshToken } from "@/utils/refresh";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
  const joinedRef = useRef(false);
  const navigate = useNavigate();
  const pendingBidRef = useRef<{
    bidAmount: number;
    callback: (error?: string) => void;
  } | null>(null);

  const reconnect = useCallback(async () => {
    try {
      const refreshed = await refreshToken();
      if (!refreshed) {
        throw new Error("Token refresh failed");
      }
      socketRef.current.disconnect().connect();
      joinedRef.current = false;
      return true;
    } catch (error) {
      console.error("Reconnection failed:", error);
      return false;
    }
  }, []);

  const placeBid = useCallback(
    (bidAmount: number, callback: (error?: string) => void) => {
      if (!email) {
        callback("User not authenticated");
        return;
      }

      const timeoutId = setTimeout(() => {
        callback("Bid failed: No response from server");
        pendingBidRef.current = null;
      }, 5000);

      const emitBid = () => {
        socketRef.current.emit(
          "placeBid",
          { artworkId, email, bidAmount },
          (response: { success: boolean; error?: string }) => {
            clearTimeout(timeoutId);
            pendingBidRef.current = null;
            if (!response.success) {
              callback(response.error || "Failed to place bid");
            } else {
              callback();
            }
          }
        );
      };

      if (pendingBidRef.current) {
        callback("Another bid is being processed");
        return;
      }

      pendingBidRef.current = { bidAmount, callback };
      emitBid();
    },
    [artworkId, email]
  );

  useEffect(() => {
    if (!email || !artworkId || joinedRef.current) return;

    const s = socketRef.current;

    console.log("emitted joinAuction");
    s.emit("joinAuction", { artworkId, email });
    joinedRef.current = true;

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

    s.on("error", async (error: { message: string; code?: string }) => {
      console.error("Socket error:", error.message);
      if (error.code === "TOKEN_EXPIRED" && pendingBidRef.current) {
        const reconnected = await reconnect();
        if (reconnected) {
          s.emit("joinAuction", { artworkId, email });
          joinedRef.current = true;
          const { bidAmount, callback } = pendingBidRef.current;
          placeBid(bidAmount, callback);
        } else {
          logout();
          navigate("/login");
          pendingBidRef.current.callback("Authentication failed");
          pendingBidRef.current = null;
        }
      } else if (error.message === "Token not found") {
        logout();
        navigate("/login");
        if (pendingBidRef.current) {
          pendingBidRef.current.callback("Authentication failed");
          pendingBidRef.current = null;
        }
      }
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
      joinedRef.current = false;
    });

    s.on("connect", () => {
      console.log("Socket reconnected");

      if (!joinedRef.current) {
        s.emit("joinAuction", { artworkId, email });
        joinedRef.current = true;
        console.log("Rejoined auction room after reconnect");
      }
    });

    return () => {
      console.log("Cleaning up socket");
      s.emit("leaveAuction", { artworkId, email });
      s.off("newBid");
      s.off("auctionEnded");
      s.off("error");
      s.off("disconnect");
      joinedRef.current = false;
    };
  }, [artworkId, email, navigate, placeBid, reconnect]);

  return { placeBid };
};
