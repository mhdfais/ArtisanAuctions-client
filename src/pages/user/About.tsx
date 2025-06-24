import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header Section */}
      <header className="py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
          About ArtVibe Auction
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-[#D6A85F] to-[#B8956A] rounded-full mx-auto"></div>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Connecting artists and collectors through a vibrant, transparent, and innovative art marketplace.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-6 text-center">
            Our Mission
          </h2>
          <div className="bg-white/80 backdrop-blur-sm shadow-xl border-[#D6A85F]/20 rounded-xl p-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              At <span className="font-semibold text-[#D6A85F]">ArtVibe Auction</span>, our mission is to democratize the art world by providing a vibrant marketplace where artists of all backgrounds can showcase their creations and collectors can discover unique pieces that inspire. We strive to foster a community built on authenticity, accessibility, and appreciation for artistic expression.
            </p>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-6 text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Artists */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-[#D6A85F]/20 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">For Artists</h3>
              <p className="text-gray-600">
                A dedicated seller dashboard to manage your artwork listings, schedule auctions, and track sales. Our intuitive interface allows you to upload multiple images, set reserve prices, and engage with buyers effortlessly. With a streamlined approval process, you can start sharing your art with the world in no time.
              </p>
            </div>
            {/* For Collectors */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-[#D6A85F]/20 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">For Collectors</h3>
              <p className="text-gray-600">
                Explore a curated selection of artworks across diverse categories, from paintings to digital art. Bid with confidence in real-time auctions, with secure payment options powered by Stripe and transparent bidding histories. Whether you're a seasoned collector or a first-time buyer, ArtVibe Auction makes art acquisition exciting and accessible.
              </p>
            </div>
            {/* Innovative Features */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-[#D6A85F]/20 shadow-lg md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Innovative Features</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Real-time auction updates via WebSocket technology.</li>
                <li>Image cropping and multi-image support for rich artwork presentations.</li>
                <li>Wallet management with balance checks and hold releases for seamless bidding.</li>
                <li>A responsive, modern interface built with React and TypeScript for a smooth user experience.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-6 text-center">
            Why Choose ArtVibe Auction?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <h3 className="text-lg font-semibold text-[#D6A85F] mb-2">Transparency</h3>
              <p className="text-gray-600 text-sm">
                Clear communication at every step, from artwork approval to auction outcomes.
              </p>
            </div>
            <div className="text-center p-4">
              <h3 className="text-lg font-semibold text-[#D6A85F] mb-2">Security</h3>
              <p className="text-gray-600 text-sm">
                Secure transactions and robust backend validation protect your data and funds.
              </p>
            </div>
            <div className="text-center p-4">
              <h3 className="text-lg font-semibold text-[#D6A85F] mb-2">Community</h3>
              <p className="text-gray-600 text-sm">
                We celebrate the stories behind each artwork, connecting artists and collectors.
              </p>
            </div>
            <div className="text-center p-4">
              <h3 className="text-lg font-semibold text-[#D6A85F] mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Built on the MERN stack with TypeScript for performance and reliability.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-6 text-center">
            Our Story
          </h2>
          <div className="bg-white/80 backdrop-blur-sm shadow-xl border-[#D6A85F]/20 rounded-xl p-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              Founded by a team of art enthusiasts and tech innovators, <span className="font-semibold text-[#D6A85F]">ArtVibe Auction</span> was born from a desire to bridge the gap between traditional art markets and the digital age. We saw an opportunity to create a platform that empowers artists to reach global audiences while offering collectors a trusted space to discover new talent. Today, we’re proud to be a growing community where creativity thrives.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-6">
            Join Our Community
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Whether you’re an artist ready to share your vision or a collector seeking your next masterpiece, ArtVibe Auction is your home for art.
          </p>
          <Button
            className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white hover:from-[#C19A56] hover:to-[#D6A85F] px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => window.location.href = "/signup"} // Adjust route as needed
          >
            Get Started
          </Button>
        </section>
      </main>

      {/* Footer Contact */}
      <footer className="bg-gradient-to-r from-amber-50 to-orange-50 py-8 text-center border-t border-[#D6A85F]/20">
        <p className="text-gray-600 mb-4">
          Have questions? Reach out at{" "}
          <a
            href="mailto:support@artvibeauction.com"
            className="text-[#D6A85F] hover:text-[#C19A56] underline"
          >
            support@artvibeauction.com
          </a>{" "}
          or follow us on{" "}
          <a
            href="https://x.com/artvibeauction"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D6A85F] hover:text-[#C19A56] underline"
          >
            Twitter
          </a>.
        </p>
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ArtVibe Auction. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default About