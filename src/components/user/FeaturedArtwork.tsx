import React from 'react';

const FeaturedArtwork: React.FC = () => {
  return (
    <section className="relative h-[70vh] bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] overflow-hidden">
      <div className="absolute inset-0 bg-black/40"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop')"
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl text-white">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h1 className="font-serif text-xl md:text-3xl font-bold mb-4 animate-fade-in">
                Discover Extraordinary Art
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] rounded-full mb-6"></div>
              <p className="text-lg md:text-lg mb-8 opacity-90 animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                Experience the thrill of live auctions featuring curated masterpieces from emerging and established artists around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <button className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white px-6 py-2 rounded-lg hover:from-[#C19A56] hover:to-[#D6A85F] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Explore Auctions
                </button>
                <button className="border-2 border-white/70 text-white px-6 py-2 rounded-lg hover:bg-white hover:text-[#2E2E2E] transition-all duration-200 font-semibold backdrop-blur-sm">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtwork;
