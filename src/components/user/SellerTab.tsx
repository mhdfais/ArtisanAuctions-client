import React, { useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import useToast from "@/hooks/useToast";
import * as yup from "yup";
import { useFormik } from "formik";
import { ApplyForSeller, getSellerStatus } from "@/services/userService";

interface userDetail {
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  profileImage?: string;
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
  const [loading, setLoading] = useState(false);

  const [artTitle, setArtTitle] = useState("");
  const [artPrice, setArtPrice] = useState("");

  const { success, error } = useToast();

  const isProfileCompleted = () => {
    return !!(user?.name && user.email && user.phone && user.profileImage);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getSellerStatus();
        console.log(res?.data);
        setStatus(res?.data?.status || "none");
      } catch (err) {
        console.error("Failed to get seller status");
      }
    };

    fetchStatus();
  }, []);

  const handleArtworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // submit logic here
    success("Artwork submitted!");
    setShowArtworkForm(false);
    setArtTitle("");
    setArtPrice("");
  };

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
        }
        // console.log("Form submitted with:", values);
        // Optionally close form after success
        setStatus("pending");
        setShowApplyForm(false);
      } catch (err) {
        error("Error", "Failed to submit application");
        console.error("Submission error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

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

          {/* Enhanced Seller Process Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-6 md:space-x-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white font-bold text-lg shadow-lg">
                  1
                </div>
                <span className="mt-3 text-sm text-gray-700 font-semibold">
                  Apply
                </span>
              </div>

              {/* Enhanced Line */}
              <div className="h-1 w-12 md:w-16 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] rounded-full" />

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white font-bold text-lg shadow-lg">
                  2
                </div>
                <span className="mt-3 text-sm text-gray-700 font-semibold">
                  Review Details
                </span>
              </div>

              {/* Enhanced Line */}
              <div className="h-1 w-12 md:w-16 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] rounded-full" />

              {/* Step 3 */}
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

          {/* Apply Section */}
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

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={user?.name}
                    readOnly
                    className="w-full border-2 border-[#D6A85F]/30 rounded-lg px-4 py-3 bg-white/50 text-gray-700"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Name is prefilled from your profile
                  </p>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={user?.phone}
                    readOnly
                    className="w-full border-2 border-[#D6A85F]/30 rounded-lg px-4 py-3 bg-white/50 text-gray-700"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Phone is prefilled from your profile
                  </p>
                </div>

                {/* Address Field */}
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

                {/* ID Number Field */}
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

                {/* Agree to Terms */}
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

                {/* Buttons */}
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

          {/* Status Messages */}
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
          {/* {status === "rejected" && (
            <div className="text-center bg-red-50 border-2 border-red-200 p-6 rounded-xl">
              <p className="text-red-700 text-xl font-semibold">
                Your application was rejected.
              </p>
              <p className="text-gray-700">
                You may update your details and reapply.
              </p>
              <Button
                onClick={() => setShowApplyForm(true)}
                className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F] px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Reapply to Become a Seller
              </Button>
            </div>
          )} */}

          {/* Approved Seller Dashboard */}
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

              {/* Enhanced Artwork form */}
              {showArtworkForm && (
                <form
                  onSubmit={handleArtworkSubmit}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-[#D6A85F]/30 rounded-xl p-6 mb-8 space-y-6 shadow-lg"
                >
                  <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                    Add New Artwork
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Artwork Title
                    </label>
                    <input
                      type="text"
                      value={artTitle}
                      onChange={(e) => setArtTitle(e.target.value)}
                      required
                      className="w-full border-2 border-[#D6A85F]/30 rounded-lg px-4 py-3 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={artPrice}
                      onChange={(e) => setArtPrice(e.target.value)}
                      required
                      className="w-full border-2 border-[#D6A85F]/30 rounded-lg px-4 py-3 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20 bg-white"
                    />
                  </div>
                  <div className="flex justify-between gap-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F] py-3 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Submit Artwork
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowArtworkForm(false)}
                      className="flex-1 border-2 border-[#D6A85F] text-[#D6A85F] hover:bg-[#D6A85F]/10 py-3 font-medium"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Enhanced Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-[#D6A85F]/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardContent className="p-6 bg-gradient-to-br from-white to-amber-50">
                    <h3 className="text-lg font-serif font-semibold text-gray-700 mb-2">
                      Active Listings
                    </h3>
                    <p className="text-4xl font-bold text-[#D6A85F]">5</p>
                  </CardContent>
                </Card>
                <Card className="border-[#D6A85F]/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardContent className="p-6 bg-gradient-to-br from-white to-amber-50">
                    <h3 className="text-lg font-serif font-semibold text-gray-700 mb-2">
                      Total Sales
                    </h3>
                    <p className="text-4xl font-bold text-[#D6A85F]">$12,450</p>
                  </CardContent>
                </Card>
                <Card className="border-[#D6A85F]/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardContent className="p-6 bg-gradient-to-br from-white to-amber-50">
                    <h3 className="text-lg font-serif font-semibold text-gray-700 mb-2">
                      Avg. Sale Price
                    </h3>
                    <p className="text-4xl font-bold text-[#D6A85F]">$1,037</p>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Listing */}
              <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6">
                Your Listings
              </h3>
              <div className="space-y-4">
                <div className="border border-[#D6A85F]/30 rounded-xl p-6 bg-gradient-to-r from-white to-amber-50/50 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-gray-800">
                        Sunset Dreams
                      </h3>
                      <p className="text-gray-600">Listed on May 15, 2025</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-2 text-sm font-medium">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                      Price:{" "}
                      <span className="text-[#D6A85F] font-bold">$950</span>
                    </span>
                    <span className="text-gray-600 font-medium">
                      Current Bid:{" "}
                      <span className="text-green-600 font-bold">$1,200</span>
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SellerTab;
