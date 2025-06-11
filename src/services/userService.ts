import userApi from "@/config/user.axios";

export const getUserDetails = async () => {
  try {
    const response = await userApi.get("/users/getUserDetails");
    return response;
  } catch (error) {
    throw error || "Failed to get details";
  }
};

export const logoutUser = async () => {
  try {
    const response = await userApi.post("/auth/logout");
    return response;
  } catch (error) {
    throw error || "Failed to logout";
  }
};

export const updateProfile = async (formData: FormData) => {
  try {
    const response = await userApi.put("/users/updateProfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error || "Failed to update Profile";
  }
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const response = await userApi.put("/users/updatePassword", {
      currentPassword,
      newPassword,
    });
    return response;
  } catch (error) {
    throw error || "Failed to update Password";
  }
};

export const ApplyForSeller = async (idNumber: string, address: string) => {
  try {
    const response = await userApi.post("/users/ApplyForSeller", {
      idNumber,
      address,
    });
    return response;
  } catch (error) {
    throw error || "Failed to apply";
  }
};

export const getSellerStatus = async () => {
  try {
    const reponse = await userApi.get("/users/getSellerStatus");
    return reponse;
  } catch (error) {
    throw error || "failed to fetch status";
  }
};

export const addArtwork = async (formData: FormData) => {
  try {
    const response = await userApi.post("/users/addArtwork", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error || "Failed to add artwork";
  }
};

export const getArtworks = async () => {
  try {
    const response = await userApi.get("/users/getArtworks");
    return response;
  } catch (error) {
    throw error || "failed to fetch artworks";
  }
};

export const scheduleAuction = async (
  artworkId: string,
  auctionData: { startTime: string; endTime: string }
) => {
  try {
    const response = await userApi.post(`/users/schedule/${artworkId}`, {
      ...auctionData,
    });
    return response;
  } catch (error) {
    throw error || "failed to schedule action";
  }
};

export const getAllArtworks = async () => {
  try {
    const response = await userApi.get("/users/getAllArtworks");
    return response;
  } catch (error) {
    throw error || "failed to get artworks";
  }
};

export const getWallet = async () => {
  try {
    const response = await userApi.get("/users/getWallet");
    return response;
  } catch (error) {
    throw error || "failed to get wallet";
  }
};

export const initiatePaymentIntent = async (amount: any) => {
  try {
    const response = await userApi.post("/users/createPaymentIntent", {
      amount: parseFloat(amount),
    });
    return response;
  } catch (error) {
    throw error || "failed to create payment intent";
  }
};

export const confirmDeposit = async (paymentIntentId: string) => {
  try {
    const response = await userApi.post("/users/confirmDeposit", {
      paymentIntentId,
    });
    return response;
  } catch (error) {
    throw error || "failed to deposit money";
  }
};

export const getArtworkById = async (artworkId: string) => {
  try {
    const response = await userApi.get(`/users/getArtworkById/${artworkId}`);
    return response;
  } catch (error) {
    throw error || "failed to fetch artwork details";
  }
};

export const getArtworkBidHistory = async (artworkId: string) => {
  try {
    const response = await userApi.get(`/users/getArtworkBids/${artworkId}`);
    return response;
  } catch (error) {
    throw error || "failed to fetch artwork bid history";
  }
};


