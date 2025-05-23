import React from 'react';
import { Link } from 'react-router-dom';

interface FeaturedArtworkProps {
  imageUrl: string;
  title: string;
  artist: string;
  currentBid: string;
  timeRemaining: string;
}

const FeaturedArtwork: React.FC = () => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${`https://images.unsplash.com/photo-1625043094370-221909f669f5?q=80&w=2095&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-ivory">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-3">{}</h1>
          <p className="text-5xl mb-2 font-bold text-[#2E2E2E]">Art That Speaks To Your Soul</p>
          {/* Art That Speaks To Your Soul */}
          {/* Unlock a world of imagination with our curated collection of original artworks. From bold abstracts to serene landscapes, discover pieces that inspire, captivate. */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 mb-8">
            <div>
              {/* <p className="text-sm uppercase tracking-wider mb-1">Current Bid</p> */}
              <p className="text-xl text-[#2E2E2E] font-medium">Unlock a world of imagination with our curated collection of original artworks.</p>
              <p className="text-xl text-[#2E2E2E] font-medium">From bold abstracts to serene landscapes, discover pieces that inspire, captivate.</p>
            </div>
            <div>
              {/* <p className="text-sm uppercase tracking-wider mb-1">Time Remaining</p> */}
              {/* <p className="text-2xl font-medium">From bold abstracts to serene landscapes, discover pieces that inspire, captivate.</p> */}
            </div>
          </div>
          
          <div className=" sm:flex-row gap-4">
          
            <Link to="#" className=" bg-white/80 backdrop-blur-md text-center font-medium text-[#2E2E2E] px-6 py-2 rounded-md hover:bg-white/65 transition-all duration-200">
              Explore All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtwork;