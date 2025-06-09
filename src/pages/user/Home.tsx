import { useEffect, useState } from "react";
import ArtworkCard from "../../components/user/ArtworkCard";
import FeaturedArtwork from "../../components/user/FeaturedArtwork";
import { getAllArtworks } from "@/services/userService";
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

const Home = () => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F9F6F1] via-[#FDF9F3] to-[#F5F0E8]">
      <FeaturedArtwork />

      <section
        className="container mx-auto px-6 py-16 animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex justify-between items-baseline mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Current Auctions
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#D6A85F] to-[#B8956A] rounded-full"></div>
          </div>
          <a
            href="#"
            className="text-[#D6A85F] hover:text-[#B8956A] font-medium transition-colors duration-200 relative group"
          >
            View All
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6A85F] transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* <ArtworkCard />
          <ArtworkCard />
          <ArtworkCard /> */}
          {artworks.length > 0 ? (
            artworks.map((artwork) => (
              <ArtworkCard
                key={artwork._id}
                details={artwork}
                onClick={() => navigate(`/artwork/${artwork._id}`)}
              />
            ))
          ) : (
            <p>not artworks found</p>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 py-16 px-6 border-t border-[#D6A85F]/20">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#D6A85F]/20">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Want to Sell Your Art?
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#D6A85F] to-[#B8956A] rounded-full mx-auto mb-6"></div>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Join our community of talented artists and reach thousands of art
              enthusiasts. Apply now to become a verified seller on our platform
              and showcase your masterpieces to collectors worldwide.
            </p>
            <a
              href="/profile?seller=1"
              className="inline-block bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white font-semibold py-4 px-8 rounded-lg hover:from-[#C19A56] hover:to-[#D6A85F] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Apply to Become a Seller
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
