// src/services/farmerApi.ts
import axios, { AxiosError } from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL || "https://karbo.onrender.com/api/v1";

// Create axios instance
const farmerClient = axios.create({
  baseURL: BASE_URL,
});

// Attach raw JWT token in Authorization header (no "Bearer")
farmerClient.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (!config.headers) config.headers = {};
    config.headers["Authorization"] = token;
  } else {
    console.error("❌ No token found in localStorage!");
  }

  return config;
});

// Add response interceptor for better error logging
farmerClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("❌ Response error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

// ---------- Types ----------

export interface FarmerProfile {
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  upiId?: string;
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    bankName?: string;
  };
}

export interface FarmerDashboardStats {
  totalFarmlands: number;
  approvedFarmlands: number;
  pendingFarmlands: number;
  totalCredits: number;
  creditsSold: number;
  creditsAvailable: number;
  totalEarnings: number;
}

export interface Farmland {
  _id: string;
  landName: string;
  location: string;
  area: number;
  landType: string;
  cultivationMethod: string;
  status: string;
  createdAt: string;
  images: string[];
}

export interface FarmerListing {
  _id: string;
  farmlandId: string;
  totalCredits: number;
  pricePerCredit: number;
  description: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  farmland?: {
    landName?: string;
    location?: string;
    area?: number;
  };
}

const extractData = <T>(res: any): T => {
  if (res?.data && typeof res.data === "object") {
    if ("data" in res.data && res.data.data !== undefined) {
      return res.data.data as T;
    }
    return res.data as T;
  }
  return res as T;
};

const rethrow = (error: unknown): never => {
  const err = error as AxiosError<any>;
  console.error("🔴 farmerApi error:", {
    message: err.message,
    status: err.response?.status,
    statusText: err.response?.statusText,
    data: err.response?.data,
    headers: err.response?.headers,
    url: err.config?.url,
  });
  throw err;
};

// ---------- API OBJECT ----------

export const farmerApi = {
  // -------- Profile / Auth --------
  async getProfile(): Promise<FarmerProfile> {
    try {
      const res = await farmerClient.get("/profile/me");
      const data = extractData<any>(res);
      // Backend returns { success: true, user: { ... } }
      return data.user ? data.user : data;
    } catch (error) {
      return rethrow(error);
    }
  },

  async updateProfile(payload: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    upiId?: string;
    bankDetails?: {
      accountNumber?: string;
      ifscCode?: string;
      accountHolderName?: string;
      bankName?: string;
    };
  }): Promise<FarmerProfile> {
    try {
      const res = await farmerClient.put("/profile/update", payload);
      return extractData<FarmerProfile>(res);
    } catch (error) {
      return rethrow(error);
    }
  },

  async changePassword(payload: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    try {
      const res = await farmerClient.put("/profile/change-password", payload);
      return extractData<{ message: string }>(res);
    } catch (error) {
      return rethrow(error);
    }
  },

  // -------- Dashboard --------
  async getDashboardStats(): Promise<FarmerDashboardStats> {
    try {
      const res = await farmerClient.get("/dashboard/farmer");
      return extractData<FarmerDashboardStats>(res);
    } catch (error) {
      return rethrow(error);
    }
  },

  // -------- Farmland --------
  async getMyFarmlands(): Promise<Farmland[]> {
    try {
      const res = await farmerClient.get("/farmland/my");
      return extractData<Farmland[]>(res) ?? [];
    } catch (error) {
      return rethrow(error);
    }
  },

  async searchFarmlands(q: string): Promise<Farmland[]> {
    try {
      const res = await farmerClient.get("/farmland", { params: { q } });
      return extractData<Farmland[]>(res) ?? [];
    } catch (error) {
      return rethrow(error);
    }
  },

  async createFarmland(
    payload: {
      landName: string;
      location: string;
      area: string;
      landType: string;
      cultivationMethod: string;
    },
    documents: File[],
    images: File[]
  ): Promise<Farmland> {
    try {
      const formData = new FormData();
      formData.append("landName", payload.landName);
      formData.append("location", payload.location);
      formData.append("area", payload.area);
      formData.append("landType", payload.landType);
      formData.append("cultivationMethod", payload.cultivationMethod);

      // Append documents
      documents.forEach((file, index) => {
        formData.append("documents", file);
      });

      // Append images
      images.forEach((file, index) => {
        formData.append("images", file);
      });

      const res = await farmerClient.post("/farmland/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return extractData<Farmland>(res);
    } catch (error) {
      console.error("❌ Failed to create farmland");
      return rethrow(error);
    }
  },

  // -------- Marketplace (farmer side) --------
  async getMyListings(): Promise<FarmerListing[]> {
    try {
      const res = await farmerClient.get("/farmer-marketplace-listing/my");
      return extractData<FarmerListing[]>(res) ?? [];
    } catch (error) {
      return rethrow(error);
    }
  },

  async createListing(payload: {
    farmlandId: string;
    totalCredits: number;
    pricePerCredit: number;
    description: string;
  }): Promise<FarmerListing> {
    try {
      const res = await farmerClient.post(
        "/farmer-marketplace-listing/create",
        payload
      );
      return extractData<FarmerListing>(res);
    } catch (error) {
      return rethrow(error);
    }
  },

  async updateListing(
    listingId: string,
    payload: {
      totalCredits?: number;
      pricePerCredit?: number;
      description?: string;
      status?: string;
    }
  ): Promise<FarmerListing> {
    try {
      const res = await farmerClient.put(
        `/farmer-marketplace-listing/update/${listingId}`,
        payload
      );
      return extractData<FarmerListing>(res);
    } catch (error) {
      return rethrow(error);
    }
  },

  async deleteListing(listingId: string): Promise<void> {
    try {
      await farmerClient.delete(
        `/farmer-marketplace-listing/delete/${listingId}`
      );
    } catch (error) {
      return rethrow(error);
    }
  },

  async getMarketplaceListings(): Promise<FarmerListing[]> {
    try {
      const res = await farmerClient.get("/marketplace/listings");
      return extractData<FarmerListing[]>(res) ?? [];
    } catch (error) {
      return rethrow(error);
    }
  },
};