import adminApi from "@/config/admin.axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await adminApi.post("/admin/login", { email, password });
    return response;
  } catch (error) {
    throw error || "Failed to login";
  }
};

export const getApprovals = async () => {
  try {
    const response = await adminApi.get("/admin/getApprovals");
    return response;
  } catch (error) {
    throw error || "Failed to fetch approvals";
  }
};

export const approve = async (approvalId: string) => {
  try {
    const response = await adminApi.put(`/admin/approve/${approvalId}`);
    return response;
  } catch (error) {
    throw error || "Failed to approve";
  }
};

export const reject = async (approvalId: string) => {
  try {
    const response = await adminApi.put(`/admin/reject/${approvalId}`);
    return response;
  } catch (error) {
    throw error || "failed to reject";
  }
};

export const fetchArtworks=async()=>{
  try {
    const response=await adminApi.get('/admin/getArtworks')
    return response
  } catch (error) {
    throw error||'failed to fetch artworks'
  }
}

export const fetchSellers=async()=>{
  try {
    const response=await adminApi.get('/admin/getSellers')
    return response
  } catch (error) {
    throw error||'failed to fetch sellers'
  }
}

export const fetchUsers=async()=>{
  try {
    const response=await adminApi.get('/admin/getUsers')
    return response
  } catch (error) {
    throw error||'failed to fetch users'
  }
}
