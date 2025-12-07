
import axios, { AxiosError } from "axios";


const API_BASE_URL =
  import.meta.env.VITE_API_?? "https://karbo.onrender.com/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// ---- Auth token helpers ----
const TOKEN_KEY = "karbo_token";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// ---- Interceptors: attach Authorization header ----
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    // make sure headers exists, but don't change its type
    if (!config.headers) {
      config.headers = {} as any;
    }

    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});



// ---- Basic error normaliser ----
export interface NormalizedError {
  message: string;
  status?: number;
  data?: any;
}

const normalizeError = (error: unknown): NormalizedError => {
  const err = error as AxiosError<any>;
  if (err.response) {
    return {
      message:
        (err.response.data as any)?.message ||
        err.response.statusText ||
        "Something went wrong",
      status: err.response.status,
      data: err.response.data,
    };
  }
  if (err.request) {
    return {
      message: "Network error. Please check your connection.",
    };
  }
  return {
    message: (err as any)?.message || "Unknown error",
  };
};

/**
 * COMMON RESPONSE SHAPE
 * (Backend usually sends { success, message, data, ... })
 */
export interface ApiBaseResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
}

/* ------------------------------------------------------------------ */
/*                              AUTH API                              */
/* ------------------------------------------------------------------ */

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "farmer" | "company";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authAPI = {
  async register(payload: RegisterPayload): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.post<ApiBaseResponse>("/auth/register", payload);
      // If backend sends token on register, save it
      if (data.token) setToken(data.token);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async login(payload: LoginPayload): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.post<ApiBaseResponse>("/auth/login", payload);
      if (data.token) setToken(data.token);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async me(): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.get<ApiBaseResponse>("/auth/me");
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  logout() {
    setToken(null);
  },
};

/* ------------------------------------------------------------------ */
/*                            PROFILE API                             */
/* ------------------------------------------------------------------ */

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "farmer" | "company" | "admin";
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateStatusPayload {
  status: string; // e.g. "active", "inactive"
}

export const profileAPI = {
  async getProfile(): Promise<UserProfile> {
    try {
      const { data } = await api.get<ApiBaseResponse<UserProfile>>("/profile/me");
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to fetch profile" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    try {
      const { data } = await api.put<ApiBaseResponse<UserProfile>>(
        "/profile/update",
        payload
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to update profile" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async changePassword(payload: ChangePasswordPayload): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.put<ApiBaseResponse>(
        "/profile/change-password",
        payload
      );
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async updateStatus(payload: UpdateStatusPayload): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.put<ApiBaseResponse>(
        "/profile/update-status",
        payload
      );
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },
};

/* ------------------------------------------------------------------ */
/*                           FARMLAND API                             */
/* ------------------------------------------------------------------ */

export interface Farmland {
  _id: string;
  landName: string;
  location: string;
  area: string;
  landType: string;
  cultivationMethod: string;
  status: "pending" | "approved" | "rejected";
  documents?: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFarmlandPayload {
  landName: string;
  location: string;
  area: string;
  landType: string;
  cultivationMethod: string;
  documents?: File[];
  images?: File[];
}

const buildFarmlandFormData = (payload: CreateFarmlandPayload) => {
  const formData = new FormData();
  formData.append("landName", payload.landName);
  formData.append("location", payload.location);
  formData.append("area", payload.area);
  formData.append("landType", payload.landType);
  formData.append("cultivationMethod", payload.cultivationMethod);

  payload.documents?.forEach((file) => formData.append("documents", file));
  payload.images?.forEach((file) => formData.append("images", file));

  return formData;
};

export const farmlandAPI = {
  async createFarmland(payload: CreateFarmlandPayload): Promise<Farmland> {
    try {
      const formData = buildFarmlandFormData(payload);
      const { data } = await api.post<ApiBaseResponse<Farmland>>(
        "/farmland/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to create farmland" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async getMyFarmlands(): Promise<Farmland[]> {
    try {
      const { data } = await api.get<ApiBaseResponse<Farmland[]>>("/farmland/my");
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to fetch farmlands" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async searchFarmlands(q: string): Promise<Farmland[]> {
    try {
      const { data } = await api.get<ApiBaseResponse<Farmland[]>>(
        `/farmland`,
        { params: { q } }
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to search farmlands" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async getFarmlandById(id: string): Promise<Farmland> {
    try {
      const { data } = await api.get<ApiBaseResponse<Farmland>>(
        `/farmland/${id}`
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to fetch farmland" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async deleteFarmland(id: string): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.delete<ApiBaseResponse>(`/farmland/${id}`);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },
};

/* ------------------------------------------------------------------ */
/*                      FARMER MARKETPLACE API                        */
/* ------------------------------------------------------------------ */

export interface FarmerListing {
  _id: string;
  farmlandId: string;
  totalCredits: number;
  pricePerCredit: number;
  description: string;
  status: "active" | "sold" | "cancelled";
  createdAt?: string;
}

export interface CreateFarmerListingPayload {
  farmlandId: string;
  totalCredits: number;
  pricePerCredit: number;
  description: string;
}

export const farmerMarketplaceAPI = {
  async createListing(
    payload: CreateFarmerListingPayload
  ): Promise<FarmerListing> {
    try {
      const { data } = await api.post<ApiBaseResponse<FarmerListing>>(
        "/farmer-marketplace-listing/create",
        payload
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to create listing" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async getMyListings(): Promise<FarmerListing[]> {
    try {
      const { data } = await api.get<ApiBaseResponse<FarmerListing[]>>(
        "/farmer-marketplace-listing/my"
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to fetch listings" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async deleteListing(id: string): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.delete<ApiBaseResponse>(
        `/farmer-marketplace-listing/${id}`
      );
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },
};

/* ------------------------------------------------------------------ */
/*                             ADMIN API                              */
/* ------------------------------------------------------------------ */

export interface AdminDashboardStats {
  totalUsers: number;
  totalFarmers: number;
  totalCompanies: number;
  totalFarmlands: number;
  pendingFarmlands: number;
  approvedFarmlands: number;
  rejectedFarmlands: number;
  totalCredits?: number;
  totalRevenue?: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "farmer" | "company";
  status: string;
  createdAt?: string;
}

export const adminAPI = {
  // Dashboard stats
  async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      const { data } = await api.get<ApiBaseResponse<AdminDashboardStats>>(
        "/admin/dashboard-stats"
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to fetch admin stats" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  // Pending users list
  async getPendingUsers(): Promise<AdminUser[]> {
    try {
      const { data } = await api.get<ApiBaseResponse<AdminUser[]>>(
        "/admin/users/pending"
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to fetch pending users" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async approveUser(userId: string): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.patch<ApiBaseResponse>(
        `/admin/users/approve/${userId}`
      );
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async blockUser(userId: string): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.patch<ApiBaseResponse>(
        `/admin/users/block/${userId}`
      );
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  // Pending farmlands list
  async getPendingFarmlands(): Promise<Farmland[]> {
    try {
      const { data } = await api.get<ApiBaseResponse<Farmland[]>>(
        "/admin/farmlands/pending"
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to fetch pending farmlands" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async getFarmlandDetails(id: string): Promise<Farmland> {
    try {
      const { data } = await api.get<ApiBaseResponse<Farmland>>(
        `/admin/farmlands/${id}`
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to fetch farmland details" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async approveFarmland(id: string): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.patch<ApiBaseResponse>(
        `/admin/farmlands/approve/${id}`
      );
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async rejectFarmland(id: string, reason: string): Promise<ApiBaseResponse> {
    try {
      const { data } = await api.patch<ApiBaseResponse>(
        `/admin/farmlands/reject/${id}`,
        { reason }
      );
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },
};

/* ------------------------------------------------------------------ */
/*                           COMPANY API                              */
/* ------------------------------------------------------------------ */

export const companyAPI = {
  // Example: fetch marketplace listings visible to companies
  async getMarketplaceListings(params?: { q?: string }) {
    try {
      const { data } = await api.get<ApiBaseResponse<any[]>>(
        "/company/marketplace-listings",
        { params }
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to fetch listings" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  // Example: fetch my purchases
  async getMyPurchases() {
    try {
      const { data } = await api.get<ApiBaseResponse<any[]>>(
        "/company/purchases/my"
      );
      if (!data.success || !data.data) {
        throw { message: data.message || "Failed to fetch purchases" };
      }
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },
};

export default api;
