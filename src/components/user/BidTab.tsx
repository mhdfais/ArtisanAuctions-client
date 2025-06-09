
import { TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

const BidTab = () => {
  return (
    <>
      <TabsContent value="bids">
        <Card className="shadow-xl border-[#D6A85F]/20 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                Your Bids
              </h2>
              <p className="text-gray-600 text-lg">
                Track your active and past bids on auctions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-[#D6A85F]/30 rounded-xl p-6 bg-gradient-to-r from-white to-amber-50/50 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-gray-800">
                      Abstract Harmony
                    </h3>
                    <p className="text-gray-600">by Artist Name</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-2 text-sm font-medium hover:bg-emerald-100">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">
                    Your bid:{" "}
                    <span className="text-[#D6A85F] font-bold">$1,200</span>
                  </span>
                  <span className="text-gray-600 font-medium">
                    Current highest:{" "}
                    <span className="text-red-600 font-bold">$1,350</span>
                  </span>
                </div>
              </div>

              <div className="border border-[#D6A85F]/30 rounded-xl p-6 bg-gradient-to-r from-white to-amber-50/50 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-gray-800">
                      Urban Landscape
                    </h3>
                    <p className="text-gray-600">by Artist Name</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-4 py-2 text-sm font-medium hover:bg-orange-100">
                    Outbid
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">
                    Your bid:{" "}
                    <span className="text-[#D6A85F] font-bold">$850</span>
                  </span>
                  <span className="text-gray-600 font-medium">
                    Winning bid:{" "}
                    <span className="text-green-600 font-bold">$920</span>
                  </span>
                </div>
              </div>

              <div className="border border-[#D6A85F]/30 rounded-xl p-6 bg-gradient-to-r from-white to-amber-50/50 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-gray-800">
                      Mountain Serenity
                    </h3>
                    <p className="text-gray-600">by Artist Name</p>
                  </div>
                  <Badge className="bg-[#D6A85F]/20 text-[#D6A85F] border-[#D6A85F]/40 px-4 py-2 text-sm font-medium hover:bg-[#D6A85F]/20">
                    Won
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">
                    Your bid:{" "}
                    <span className="text-[#D6A85F] font-bold">$1,500</span>
                  </span>
                  <span className="text-gray-600 font-medium">
                    Winning bid:{" "}
                    <span className="text-[#D6A85F] font-bold">$1,500</span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default BidTab;
