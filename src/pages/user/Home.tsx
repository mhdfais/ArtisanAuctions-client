import ArtworkCard from "../../components/user/ArtworkCard";
import FeaturedArtwork from "../../components/user/FeaturedArtwork";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F1]">
      {/* <Navbar /> */}
      <FeaturedArtwork />
      <section
        className="container mx-auto px-6 py-16 animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex justify-between items-baseline mb-10">
          <h2 className="font-serif text-3xl md:text-4xl">Current Auctions</h2>
          <a href="#" className="text-[#D6A85F] hover:underline">
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArtworkCard />
          <ArtworkCard />
          <ArtworkCard />
        </div>
      </section>
      <section className="bg-[#F9F6F1] py-16 px-6">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Want to Sell Your Art?
          </h2>
          <p className="text-gray-700 mb-6">
            Join our community of talented artists and reach thousands of art
            enthusiasts. Apply now to become a verified seller on our platform.
          </p>
          <a
            href="/apply-seller"
            className="inline-block bg-[#D6A85F] text-white font-semibold py-3 px-6 rounded hover:bg-[#c29545] transition"
          >
            Apply to Become a Seller
          </a>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
