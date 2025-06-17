import { useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import useToast from "@/hooks/useToast";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  ApplyForSeller,
  getSellerStatus,
  getArtworks,
  scheduleAuction,
  fetchSellerWonAuctions,
  markAsShipped,
  // markAsShipped,
} from "@/services/userService";
import ArtworkForm from "./ArtworkForm";

interface userDetail {
  name: string;
  email: string;
  bio?: string | null;
  phone?: string | null;
  profileImage?: string | null;
  isSeller: boolean;
}

interface Listing {
  id: string;
  title: string;
  status: "pending" | "rejected" | "active" | "approved";
  isActive: boolean;
  isEnded: boolean;
  price: number;
  listedDate: string | null;
  highestBid: number;
  auctionStartTime?: string | null;
  auctionEndTime?: string | null;
  description?: string | null;
  medium?: string | null;
  dimensions?: string | null;
  yearCreated?: number | null;
  category?: string | null;
  imageUrl?: string | null;
  shippingStatus?: "pending" | "shipped" | null;
  shippingAddress?: string | null;
}

interface IWonAuction {
  id: string;
  amount: number;
  artworkId: string;
  auctionEndTime: string;
  title: string;
  address: {
    address: string;
    state: string;
    district: string;
    place: string;
    pincode: number;
  };
  image: string;
  status: string;
  receipt: string;
  yearCreated: string;
  dimensions: object;
  medium: string;
  description: string;
  price: string;
  highestBid: string;
  auctionStartTime: string;
  listedAt: string;
  category: string;
}

interface props {
  user: userDetail | null;
}

const SellerTab = ({ user }: props) => {
  const [status, setStatus] = useState<
    "none" | "pending" | "approved" | "rejected"
  >("none");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showArtworkForm, setShowArtworkForm] = useState(false);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "pending" | "rejected" | "active" | "finished"
  >("pending");
  const [expandedListingId, setExpandedListingId] = useState<string | null>(null);
  const [sellerWonAuctions, setSellerWonAuctions] = useState<IWonAuction[]>([]);
  const { success, error } = useToast();

  const isProfileCompleted = () => {
    return !!(user?.name && user.email && user.phone && user.profileImage);
  };

  const fetchArtworks = async () => {
    try {
      const res = await getArtworks();
      const mappedListings: Listing[] = res.data.map((artwork: any) => {
        let dimensionsString: string | null = null;
        if (artwork.dimensions?.height && artwork.dimensions?.width) {
          dimensionsString = `${artwork.dimensions.height} x ${artwork.dimensions.width} cm`;
        }

        const listing: Listing = {
          id: artwork._id || artwork.id || "",
          title: artwork.title || "Untitled",
          status: artwork.approvalStatus || "pending",
          isActive: artwork.isActive || false,
          isEnded: artwork.isEnded || false,
          price: Number(artwork.reservePrice) || 0,
          listedDate: artwork.createdAt
            ? new Date(artwork.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : null,
          highestBid: Number(artwork.highestBid) || 0,
          auctionStartTime: artwork.auctionStartTime || null,
          auctionEndTime: artwork.auctionEndTime || null,
          description: artwork.description || null,
          medium: artwork.medium || null,
          dimensions: dimensionsString,
          yearCreated: Number(artwork.yearCreated) || null,
          category: artwork.category || null,
          imageUrl:
            Array.isArray(artwork.images) && artwork.images.length > 0
              ? artwork.images[0]
              : null,
          shippingStatus: artwork.shippingStatus || "pending",
          shippingAddress: artwork.shippingAddress || null,
        };
        return listing;
      });
      setListings(mappedListings);
    } catch (err) {
      console.error("Failed to fetch listings", err);
      error("Error", "Failed to fetch listings");
    }
  };

  const fetchWonAuctions = async () => {
    try {
      const res = await fetchSellerWonAuctions();
      setSellerWonAuctions(res.data.sellerWonAuctions);
      console.log(res.data.sellerWonAuctions);
    } catch (err) {
      error("Error", "Failed to load won auctions");
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getSellerStatus();
        setStatus(res?.data?.status || "none");
      } catch (err) {
        console.error("Failed to get seller status", err);
        error("Error", "Failed to fetch seller status");
      }
    };

    if (user?.isSeller) {
      fetchStatus();
      fetchArtworks();
      if (status === "approved") {
        fetchWonAuctions();
      }
    }
  }, [user, status]);

  const formik = useFormik({
    initialValues: {
      address: "",
      idNumber: "",
      agreeToTerms: false,
    },
    validationSchema: yup.object({
      address: yup.string().required("Address is required"),
      idNumber: yup.string().required("ID Number is required"),
      agreeToTerms: yup.boolean().oneOf([true], "You must accept the terms"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await ApplyForSeller(values.idNumber, values.address);
        if (response.status === 200) {
          success(
            "Application Submitted",
            "Your application will be reviewed as soon as possible."
          );
          setStatus("pending");
          setShowApplyForm(false);
        }
      } catch (err) {
        error("Error", "Failed to submit application");
        console.error("Submission error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  const auctionFormik = useFormik({
    initialValues: {
      auctionStartTime: "",
      auctionEndTime: "",
    },
    validationSchema: yup.object({
      auctionStartTime: yup
        .date()
        .required("Start time is required")
        .min(new Date(), "Start time must be in the future"),
      auctionEndTime: yup
        .date()
        .required("End time is required")
        .min(yup.ref("auctionStartTime"), "End time must be after start time")
        .test(
          "min-duration",
          "Auction duration must be at least one hour",
          function (auctionEndTime) {
            const { auctionStartTime } = this.parent;
            if (!auctionStartTime || !auctionEndTime) return false;
            const duration =
              new Date(auctionEndTime).getTime() -
              new Date(auctionStartTime).getTime();
            return duration >= 3600000; // ----- min 1 hour
          }
        ),
    }),
    onSubmit: async (values) => {
      if (!selectedArtworkId) return;
      setLoading(true);
      try {
        const res = await scheduleAuction(selectedArtworkId, {
          startTime: new Date(values.auctionStartTime).toISOString(),
          endTime: new Date(values.auctionEndTime).toISOString(),
        });
        if (res.status === 200) {
          success("Auction Scheduled", "Your auction has been scheduled.");
          await fetchArtworks();
          setSelectedArtworkId(null);
          auctionFormik.resetForm();
        }
      } catch (err) {
        error("Error", "Failed to schedule auction");
        console.error("Auction scheduling error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleMarkAsShipped = async (artworkId: string) => {
    setLoading(true);
    try {
      const res = await markAsShipped(artworkId);
      if (res.status === 200) {
        success("Shipping Updated", "Artwork marked as shipped.");
        await fetchWonAuctions();
        await fetchArtworks();
      }
    } catch (err) {
      error("Error", "Failed to mark artwork as shipped");
      console.error("Mark as shipped error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyles = (
    status: Listing["status"] | Listing["shippingStatus"]
  ) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      case "pending":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-600 border-red-200";
      case "approved":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "shipped":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const formatAddress = (address: IWonAuction["address"]): string => {
    if (!address) return "N/A";
    const { address: street, place, district, state, pincode } = address;
    return (
      [street, place, district, state, pincode?.toString()]
        .filter(Boolean)
        .join(", ") || "N/A"
    );
  };

  const formatDimensions = (dimensions: object): string | null => {
    if (!dimensions) return null;
    const { height, width } = dimensions as any;
    if (height && width) {
      return `${height} x ${width} cm`;
    }
    return null;
  };

  const statusSections = [
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "active", label: "Active" },
    { value: "finished", label: "Finished" },
  ];

  const filteredListings = (() => {
    if (selectedStatus === "pending") {
      return listings.filter((listing) => listing.status === "pending");
    }
    if (selectedStatus === "rejected") {
      return listings.filter((listing) => listing.status === "rejected");
    }
    if (selectedStatus === "active") {
      return listings.filter(
        (listing) => listing.status === "approved" && !listing.isEnded
      );
    }
    if (selectedStatus === "finished") {
      return sellerWonAuctions.map((auction: IWonAuction) => {
        return {
          id: auction.artworkId,
          title: auction.title || "Untitled",
          status: auction.status,
          price: Number(auction.price) || auction.amount,
          listedDate: auction.listedAt
            ? new Date(auction.listedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : null,
          highestBid: Number(auction.highestBid) || auction.amount,
          auctionStartTime: auction.auctionStartTime || null,
          auctionEndTime: auction.auctionEndTime || null,
          description: auction.description || null,
          medium: auction.medium || null,
          dimensions: formatDimensions(auction.dimensions),
          yearCreated: Number(auction.yearCreated) || null,
          category: auction.category || null,
          imageUrl: auction.image || null,
          shippingStatus: (auction.status as "pending" | "shipped") || "pending",
          shippingAddress: formatAddress(auction.address),
        } as Listing;
      });
    }
    return [];
  })();

  useEffect(() => {}, [selectedStatus, listings, sellerWonAuctions]);

  return (
    <TabsContent value="seller-dashboard">
      <Card className="shadow-xl border-[#D6A85F]/20 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
              Seller Dashboard
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#D6A85F] to-[#B8956A] rounded-full"></div>
          </div>

          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-6 md:space-x-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white font-bold text-lg shadow-lg">
                  1
                </div>
                <span className="mt-3 text-sm text-gray-700 font-semibold">
                  Apply
                </span>
              </div>
              <div className="h-1 w-12 md:w-16 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] rounded-full" />
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white font-bold text-lg shadow-lg">
                  2
                </div>
                <span className="mt-3 text-sm text-gray-700 font-semibold">
                  Review Details
                </span>
              </div>
              <div className="h-1 w-12 md:w-16 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] rounded-full" />
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white font-bold text-lg shadow-lg">
                  3
                </div>
                <span className="mt-3 text-sm text-gray-700 font-semibold">
                  Approval
                </span>
              </div>
            </div>
          </div>

          {(status === "none" || status === "rejected") && !showApplyForm && (
            <div className="text-center bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-xl border border-[#D6A85F]/20">
              {!isProfileCompleted() ? (
                <p className="text-red-600 font-medium">
                  Please complete your profile (name, phone, email, and profile
                  image) before applying.
                </p>
              ) : (
                <>
                  <p className="text-gray-700 mb-6 text-lg">
                    {status === "rejected"
                      ? "Your application was rejected. You can update your details and reapply."
                      : "Apply to become a seller to list your artwork."}
                  </p>
                  <Button
                    className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white hover:from-[#C19A56] hover:to-[#D6A85F] px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => setShowApplyForm(true)}
                  >
                    {status === "rejected"
                      ? "Reapply to Become a Seller"
                      : "Apply to Become a Seller"}
                  </Button>
                </>
              )}
            </div>
          )}

          {(status === "none" || status === "rejected") && showApplyForm && (
            <div className="max-w-2xl mx-auto">
              <form
                onSubmit={formik.handleSubmit}
                className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-xl border-2 border-[#D6A85F]/30 space-y-6 shadow-lg"
              >
                <h3 className="text-center font-serif text-3xl font-bold text-gray-800 mb-6">
                  Seller Application Form
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={user?.name || ""}
                    readOnly
                    className="w-full border-2 border-[#D6A85F]/30 rounded-lg px-4 py-3 bg-white/50 text-gray-700"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Name is prefilled from your profile
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={user?.phone || ""}
                    readOnly
                    className="w-full border-2 border-[#D6A85F]/30 rounded-lg px-4 py-3 bg-white/50 text-gray-700"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Phone is prefilled from your profile
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    className="w-full border-2 border-[#D6A85F]/30 rounded-lg px-4 py-3 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20 bg-white"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Current residential address
                  </p>
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Identification Number
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formik.values.idNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    className="w-full border-2 border-[#D6A85F]/30 rounded-lg px-4 py-3 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20 bg-white"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    e.g., National ID or Passport Number
                  </p>
                  {formik.touched.idNumber && formik.errors.idNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.idNumber}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-3 bg-white/70 p-4 rounded-lg border border-[#D6A85F]/20">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formik.values.agreeToTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="text-[#D6A85F] focus:ring-[#D6A85F]"
                  />
                  <label className="text-sm text-gray-700">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-[#D6A85F] font-semibold underline hover:text-[#C19A56]"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.agreeToTerms}
                  </p>
                )}
                <div className="flex justify-between gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F] py-3 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="flex-1 border-2 border-[#D6A85F] text-[#D6A85F] hover:bg-[#D6A85F]/10 py-3 font-medium"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {status === "pending" && (
            <div className="text-center bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl">
              <p className="text-yellow-700 text-xl font-semibold">
                Your application is under review.
              </p>
              <p className="text-yellow-700 text-sm font-semibold">
                Please wait 2-3 business days for approval.
              </p>
            </div>
          )}

          {status === "approved" && (
            <>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                <p className="text-gray-700 text-lg font-medium">
                  You're approved to list and sell artworks.
                </p>
                <Button
                  onClick={() => setShowArtworkForm(true)}
                  className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F] px-6 py-3 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Add Artwork
                </Button>
              </div>

              {showArtworkForm && (
                <ArtworkForm
                  cancel={() => setShowArtworkForm(false)}
                  fetchArtworks={fetchArtworks}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-[#D6A85F]/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardContent className="p-6 bg-gradient-to-br from-white to-amber-50">
                    <h3 className="text-lg font-serif font-semibold text-gray-700 mb-2">
                      Active Listings
                    </h3>
                    <p className="text-4xl font-bold text-[#D6A85F]">
                      {
                        listings.filter(
                          (l) => l.status === "approved" && l.isActive && !l.isEnded
                        ).length
                      }
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-[#D6A85F]/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardContent className="p-6 bg-gradient-to-br from-white to-amber-50">
                    <h3 className="text-lg font-serif font-semibold text-gray-700 mb-2">
                      Total Sales
                    </h3>
                    <p className="text-4xl font-bold text-[#D6A85F]">
                      ₹
                      {sellerWonAuctions
                        .reduce((sum, auction) => sum + Number(auction.amount), 0)
                        .toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-[#D6A85F]/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardContent className="p-6 bg-gradient-to-br from-white to-amber-50">
                    <h3 className="text-lg font-serif font-semibold text-gray-700 mb-2">
                      Avg. Sale Price
                    </h3>
                    <p className="text-4xl font-bold text-[#D6A85F]">
                      ₹
                      {sellerWonAuctions.length
                        ? Math.round(
                            sellerWonAuctions.reduce(
                              (sum, auction) => sum + Number(auction.amount),
                              0
                            ) / sellerWonAuctions.length
                          ).toLocaleString()
                        : "0"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-6">
                <div className="flex justify-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 p-2 rounded-xl border border-[#D6A85F]/20">
                  {statusSections.map((section) => (
                    <button
                      key={section.value}
                      onClick={() => setSelectedStatus(section.value as any)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        selectedStatus === section.value
                          ? "bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-[#D6A85F]/10 border border-[#D6A85F]/30"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-[200px]">
                {filteredListings.length === 0 ? (
                  <p className="text-gray-600 text-center">
                    No {selectedStatus} listings available.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredListings.map((listing) => {
                      const hasDetails = !!(
                        listing.description ||
                        listing.medium ||
                        listing.dimensions ||
                        listing.yearCreated != null ||
                        listing.category ||
                        listing.imageUrl ||
                        listing.shippingAddress
                      );

                      return (
                        <div
                          key={listing.id}
                          className="border border-[#D6A85F]/30 rounded-xl p-6 bg-gradient-to-r from-white to-amber-50/50 shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h3 className="font-serif text-xl font-semibold text-gray-800">
                                {listing.title}
                              </h3>
                              <p className="text-gray-600">
                                Listed on {listing.listedDate || "N/A"}
                              </p>
                              {listing.auctionStartTime && listing.auctionEndTime && (
                                <p className="text-gray-600 text-sm">
                                  Auction:{" "}
                                  {new Date(listing.auctionStartTime).toLocaleString()} -{" "}
                                  {new Date(listing.auctionEndTime).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              <Badge
                                className={`${
                                  selectedStatus === "active"
                                    ? getBadgeStyles("active")
                                    : selectedStatus === "finished"
                                    ? getBadgeStyles(listing.shippingStatus || "pending")
                                    : getBadgeStyles(listing.status)
                                } px-2 py-1 text-sm font-medium`}
                              >
                                {selectedStatus === "active"
                                  ? "Active"
                                  : selectedStatus === "finished"
                                  ? listing.shippingStatus
                                    ? listing.shippingStatus.charAt(0).toUpperCase() +
                                      listing.shippingStatus.slice(1)
                                    : "Pending"
                                  : listing.status.charAt(0).toUpperCase() +
                                    listing.status.slice(1)}
                              </Badge>
                              <Button
                                onClick={() =>
                                  setExpandedListingId(
                                    expandedListingId === listing.id ? null : listing.id
                                  )
                                }
                                className="bg-[#D6A85F]/10 text-[#D6A85F] hover:bg-[#D6A85F]/20 border border-[#D6A85F] px-4 py-2 text-sm font-medium"
                                disabled={!hasDetails}
                              >
                                {expandedListingId === listing.id ? "Hide Details" : "View Details"}
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm mb-4">
                            <span className="text-gray-600 font-medium">
                              Price:{" "}
                              <span className="text-[#D6A85F] font-bold">
                                ₹{listing.price.toLocaleString()}
                              </span>
                            </span>
                            {listing.highestBid > 0 && (
                              <span className="text-gray-600 font-medium">
                                Final Bid:{" "}
                                <span className="text-green-600 font-bold">
                                  ₹{listing.highestBid.toLocaleString()}
                                </span>
                              </span>
                            )}
                            {selectedStatus === "active" &&
                              listing.status === "approved" &&
                              !listing.auctionStartTime &&
                              !listing.auctionEndTime && (
                                <Button
                                  onClick={() =>
                                    setSelectedArtworkId(
                                      selectedArtworkId === listing.id ? null : listing.id
                                    )
                                  }
                                  className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F] px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                  {selectedArtworkId === listing.id ? "Cancel" : "Schedule Auction"}
                                </Button>
                              )}
                            {selectedStatus === "finished" &&
                              listing.shippingStatus === "pending" && (
                                <Button
                                  onClick={() => handleMarkAsShipped(listing.id)}
                                  disabled={!listing.shippingAddress || loading}
                                  className={`px-4 py-2 text-sm font-medium shadow-md transition-all duration-200 ${
                                    listing.shippingAddress
                                      ? "bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F]"
                                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  }`}
                                >
                                  {loading ? "Processing..." : "Mark as Shipped"}
                                </Button>
                              )}
                          </div>
                          {selectedStatus === "finished" &&
                            listing.shippingStatus === "pending" &&
                            !listing.shippingAddress && (
                              <p className="text-red-500 text-sm mb-4">
                                Waiting for winner to provide shipping address.
                              </p>
                            )}
                          {expandedListingId === listing.id && (
                            <div className="bg-amber-50/50 p-4 rounded-lg border border-[#D6A85F]/20">
                              <h4 className="font-serif text-lg font-semibold text-gray-800 mb-3">
                                Artwork Details
                              </h4>
                              {listing.imageUrl ? (
                                <img
                                  src={listing.imageUrl}
                                  alt={listing.title}
                                  className="w-full max-w-[200px] h-auto rounded-lg mb-4"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder-image.jpg";
                                  }}
                                />
                              ) : (
                                <p className="text-gray-600 mb-4 text-sm">No image available</p>
                              )}
                              <p className="text-gray-600 mb-2">
                                <span className="font-medium">Description:</span>{" "}
                                {listing.description || "No description available"}
                              </p>
                              <p className="text-gray-600 mb-2">
                                <span className="font-medium">Medium:</span> {listing.medium || "N/A"}
                              </p>
                              <p className="text-gray-600 mb-2">
                                <span className="font-medium">Dimensions:</span>{" "}
                                {listing.dimensions || "N/A"}
                              </p>
                              <p className="text-gray-600 mb-2">
                                <span className="font-medium">Year Created:</span>{" "}
                                {listing.yearCreated != null ? listing.yearCreated : "N/A"}
                              </p>
                              <p className="text-gray-600 mb-2">
                                <span className="font-medium">Category:</span>{" "}
                                {listing.category || "N/A"}
                              </p>
                              {selectedStatus === "finished" && listing.shippingAddress && (
                                <p className="text-gray-600">
                                  <span className="font-medium">Shipping Address:</span>{" "}
                                  {listing.shippingAddress}
                                </p>
                              )}
                              {selectedStatus === "finished" && (
                                <p className="text-gray-600">
                                  <span className="font-medium">Receipt:</span>{" "}
                                  <a
                                    href={(listing as any).receipt}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#D6A85F] underline hover:text-[#C19A56]"
                                  >
                                    View Receipt
                                  </a>
                                </p>
                              )}
                            </div>
                          )}
                          {selectedStatus === "active" &&
                            listing.status === "approved" &&
                            !listing.auctionStartTime &&
                            !listing.auctionEndTime &&
                            selectedArtworkId === listing.id && (
                              <form
                                onSubmit={auctionFormik.handleSubmit}
                                className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-[#D6A85F]/30 space-y-4"
                              >
                                <h4 className="font-serif text-lg font-semibold text-gray-800">
                                  Schedule Auction for {listing.title}
                                </h4>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Time
                                  </label>
                                  <input
                                    type="datetime-local"
                                    name="auctionStartTime"
                                    value={auctionFormik.values.auctionStartTime}
                                    onChange={auctionFormik.handleChange}
                                    onBlur={auctionFormik.handleBlur}
                                    className="w-full border-2 border-[#D6A85F]/30 rounded-lg px-4 py-3 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20 bg-white"
                                  />
                                  {auctionFormik.touched.auctionStartTime &&
                                    auctionFormik.errors.auctionStartTime && (
                                      <p className="text-red-500 text-sm mt-1">
                                        {auctionFormik.errors.auctionStartTime}
                                      </p>
                                    )}
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    End Time
                                  </label>
                                  <input
                                    type="datetime-local"
                                    name="auctionEndTime"
                                    value={auctionFormik.values.auctionEndTime}
                                    onChange={auctionFormik.handleChange}
                                    onBlur={auctionFormik.handleBlur}
                                    className="w-full border-2 border-[#D6A85F]/30 rounded-lg px-4 py-3 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20 bg-white"
                                  />
                                  {auctionFormik.touched.auctionEndTime &&
                                    auctionFormik.errors.auctionEndTime && (
                                      <p className="text-red-500 text-sm mt-1">
                                        {auctionFormik.errors.auctionEndTime}
                                      </p>
                                    )}
                                </div>
                                <div className="flex justify-between gap-4 pt-2">
                                  <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F] py-3 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                                  >
                                    {loading ? "Scheduling..." : "Schedule Auction"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                      setSelectedArtworkId(null);
                                      auctionFormik.resetForm();
                                    }}
                                    className="flex-1 border-2 border-[#D6A85F] text-[#D6A85F] hover:bg-[#D6A85F]/10 py-3 font-medium"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SellerTab;