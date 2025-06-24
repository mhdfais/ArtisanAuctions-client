import ArtworkCard from "@/components/user/ArtworkCard";
import { getAllArtworks } from "@/services/userService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const Auctions = () => {
  const [artworks, setArtworks] = useState<IArtwork[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      const res = await getAllArtworks();
      setArtworks(res.data?.artworks);
      // console.log(res.data.artworks);
      // console.log(artworks,'------')
    };

    fetchArtworks();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-600 ml-5 mt-5">
          We have found <span className="text-[#D6A85F]">{artworks.length}</span> items for you
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
          {artworks.length > 0 ? (
            artworks.map((artwork) => (
              <ArtworkCard
                key={artwork._id}
                details={artwork}
                onClick={() => navigate(`/artwork/${artwork._id}`)}
              />
            ))
          ) : (
            <p>no artworks found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Auctions;
