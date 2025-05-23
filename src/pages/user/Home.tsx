import ArtworkCard from "../../components/ArtworkCard";
import FeaturedArtwork from "../../components/FeaturedArtwork";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

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
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
