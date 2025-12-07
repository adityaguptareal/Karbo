export interface Farmer {
  id: string;
  name: string;
  farmName: string;
  location: string;
  state: string;
  avatar: string;
  practices: string[];
  totalCredits: number;
  creditsAvailable: number;
  creditsSold: number;
  rating: number;
  verified: boolean;
  joinedDate: string;
  farmSize: string;
}

export interface CarbonCredit {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  location: string;
  state: string;
  practiceType: string;
  credits: number;
  pricePerCredit: number;
  verified: boolean;
  verificationDate: string;
  co2Offset: number;
  description: string;
  image: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  logo: string;
  totalPurchased: number;
  totalSpent: number;
  co2Offset: number;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'withdrawal';
  amount: number;
  credits?: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export interface VerificationRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  documentType: string;
  submittedDate: string;
  status: 'pending' | 'under_review' | 'verified' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  documents: string[];
  reviewedBy?: string;
  reviewNotes?: string;
  reviewDate?: string;
}

// NEW: Company Request Interface
export interface CompanyRequest {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  creditsNeeded: number;
  practiceType: string[];
  maxPricePerCredit: number;
  preferredStates?: string[];
  deadline: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed' | 'completed';
  postedDate: string;
  bidsCount: number;
}

// NEW: Farmer Bid Interface
export interface FarmerBid {
  id: string;
  requestId: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  creditsOffered: number;
  pricePerCredit: number;
  deliveryTime: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedDate: string;
}

export const farmers: Farmer[] = [
  {
    id: "f1",
    name: "Ramesh Kumar",
    farmName: "Green Valley Organics",
    location: "Pune",
    state: "Maharashtra",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    practices: ["Organic Farming", "No-Till Agriculture", "Crop Rotation"],
    totalCredits: 2450,
    creditsAvailable: 1200,
    creditsSold: 1250,
    rating: 4.9,
    verified: true,
    joinedDate: "2023-03-15",
    farmSize: "180 hectares"
  },
  {
    id: "f2",
    name: "Priya Sharma",
    farmName: "Sunrise Sustainable Farm",
    location: "Vadodara",
    state: "Gujarat",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    practices: ["Avoiding Stubble Burning", "Organic Fertilizers", "Water Conservation"],
    totalCredits: 1890,
    creditsAvailable: 890,
    creditsSold: 1000,
    rating: 4.7,
    verified: true,
    joinedDate: "2023-05-22",
    farmSize: "130 hectares"
  },
  {
    id: "f3",
    name: "Arjun Singh",
    farmName: "Savanna Green Farms",
    location: "Amritsar",
    state: "Punjab",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    practices: ["Agroforestry", "Organic Farming", "Biodiversity Conservation"],
    totalCredits: 3200,
    creditsAvailable: 1800,
    creditsSold: 1400,
    rating: 4.8,
    verified: true,
    joinedDate: "2022-11-08",
    farmSize: "275 hectares"
  },
  {
    id: "f4",
    name: "Lakshmi Reddy",
    farmName: "Deccan Organic Estate",
    location: "Hyderabad",
    state: "Telangana",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
    practices: ["Regenerative Agriculture", "Cover Crops", "No-Till Agriculture"],
    totalCredits: 1560,
    creditsAvailable: 560,
    creditsSold: 1000,
    rating: 4.6,
    verified: true,
    joinedDate: "2023-01-20",
    farmSize: "220 hectares"
  },
  {
    id: "f5",
    name: "Vikram Patel",
    farmName: "Harmony Fields",
    location: "Nashik",
    state: "Maharashtra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    practices: ["Terraced Farming", "Organic Cultivation", "Soil Restoration"],
    totalCredits: 980,
    creditsAvailable: 480,
    creditsSold: 500,
    rating: 4.5,
    verified: false,
    joinedDate: "2023-08-12",
    farmSize: "60 hectares"
  },
  {
    id: "f6",
    name: "Anjali Deshmukh",
    farmName: "Konkan Eco Farms",
    location: "Ratnagiri",
    state: "Maharashtra",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    practices: ["Organic Horticulture", "Solar Irrigation", "Biodiversity Corridors"],
    totalCredits: 2100,
    creditsAvailable: 1100,
    creditsSold: 1000,
    rating: 4.9,
    verified: true,
    joinedDate: "2022-09-05",
    farmSize: "150 hectares"
  }
];

export const carbonCredits: CarbonCredit[] = [
  {
    id: "cc1",
    farmerId: "f1",
    farmerName: "Ramesh Kumar",
    farmName: "Green Valley Organics",
    location: "Pune",
    state: "Maharashtra",
    practiceType: "Organic Farming",
    credits: 500,
    pricePerCredit: 1850,
    verified: true,
    verificationDate: "2024-01-15",
    co2Offset: 500,
    description: "Premium organic farming credits from certified sustainable practices in Maharashtra highlands.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400"
  },
  {
    id: "cc2",
    farmerId: "f1",
    farmerName: "Ramesh Kumar",
    farmName: "Green Valley Organics",
    location: "Pune",
    state: "Maharashtra",
    practiceType: "No-Till Agriculture",
    credits: 350,
    pricePerCredit: 2200,
    verified: true,
    verificationDate: "2024-01-20",
    co2Offset: 350,
    description: "No-till farming credits preserving soil carbon and reducing emissions.",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400"
  },
  {
    id: "cc3",
    farmerId: "f2",
    farmerName: "Priya Sharma",
    farmName: "Sunrise Sustainable Farm",
    location: "Vadodara",
    state: "Gujarat",
    practiceType: "Avoiding Stubble Burning",
    credits: 600,
    pricePerCredit: 1500,
    verified: true,
    verificationDate: "2024-02-01",
    co2Offset: 600,
    description: "Credits from stubble retention practices, preventing harmful air pollution.",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400"
  },
  {
    id: "cc4",
    farmerId: "f3",
    farmerName: "Arjun Singh",
    farmName: "Savanna Green Farms",
    location: "Amritsar",
    state: "Punjab",
    practiceType: "Agroforestry",
    credits: 800,
    pricePerCredit: 2500,
    verified: true,
    verificationDate: "2024-01-28",
    co2Offset: 800,
    description: "High-quality agroforestry credits combining tree planting with sustainable agriculture.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
  },
  {
    id: "cc5",
    farmerId: "f3",
    farmerName: "Arjun Singh",
    farmName: "Savanna Green Farms",
    location: "Amritsar",
    state: "Punjab",
    practiceType: "Biodiversity Conservation",
    credits: 450,
    pricePerCredit: 2800,
    verified: true,
    verificationDate: "2024-02-05",
    co2Offset: 450,
    description: "Premium credits supporting wildlife corridors and native species preservation.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400"
  },
  {
    id: "cc6",
    farmerId: "f4",
    farmerName: "Lakshmi Reddy",
    farmName: "Deccan Organic Estate",
    location: "Hyderabad",
    state: "Telangana",
    practiceType: "Regenerative Agriculture",
    credits: 400,
    pricePerCredit: 2000,
    verified: true,
    verificationDate: "2024-01-10",
    co2Offset: 400,
    description: "Regenerative farming credits improving soil health and sequestering carbon.",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400"
  },
  {
    id: "cc7",
    farmerId: "f5",
    farmerName: "Vikram Patel",
    farmName: "Harmony Fields",
    location: "Nashik",
    state: "Maharashtra",
    practiceType: "Organic Cultivation",
    credits: 250,
    pricePerCredit: 1950,
    verified: false,
    verificationDate: "",
    co2Offset: 250,
    description: "Sustainable organic cultivation credits from Maharashtra vineyards.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400"
  },
  {
    id: "cc8",
    farmerId: "f6",
    farmerName: "Anjali Deshmukh",
    farmName: "Konkan Eco Farms",
    location: "Ratnagiri",
    state: "Maharashtra",
    practiceType: "Solar Irrigation",
    credits: 550,
    pricePerCredit: 1700,
    verified: true,
    verificationDate: "2024-02-10",
    co2Offset: 550,
    description: "Credits from solar-powered irrigation reducing energy consumption in Konkan region.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
  }
];

export const companies: Company[] = [
  {
    id: "c1",
    name: "TCS Green Initiative",
    industry: "Information Technology",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100",
    totalPurchased: 2500,
    totalSpent: 5250000,
    co2Offset: 2500
  },
  {
    id: "c2",
    name: "Reliance Industries Ltd",
    industry: "Manufacturing",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100",
    totalPurchased: 5000,
    totalSpent: 9500000,
    co2Offset: 5000
  },
  {
    id: "c3",
    name: "IndiGo Airlines",
    industry: "Aviation",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100",
    totalPurchased: 15000,
    totalSpent: 28500000,
    co2Offset: 15000
  }
];

export const transactions: Transaction[] = [
  { id: "t1", type: "sale", amount: 92500, credits: 50, date: "2024-02-15", status: "completed", description: "Sold to TCS Green Initiative" },
  { id: "t2", type: "sale", amount: 185000, credits: 100, date: "2024-02-10", status: "completed", description: "Sold to Reliance Industries" },
  { id: "t3", type: "withdrawal", amount: 200000, date: "2024-02-08", status: "completed", description: "Bank transfer to ICICI Bank" },
  { id: "t4", type: "sale", amount: 46250, credits: 25, date: "2024-02-01", status: "completed", description: "Sold to IndiGo Airlines" },
  { id: "t5", type: "sale", amount: 55500, credits: 30, date: "2024-01-28", status: "pending", description: "Pending verification" },
  { id: "t6", type: "withdrawal", amount: 150000, date: "2024-01-20", status: "completed", description: "Bank transfer to SBI" },
];

export const verificationRequests: VerificationRequest[] = [
  {
    id: "v1",
    farmerId: "f5",
    farmerName: "Vikram Patel",
    documentType: "Land Ownership (7/12 Extract)",
    submittedDate: "2024-02-14",
    status: "pending",
    priority: "high",
    documents: ["7_12_extract.pdf", "property_map.jpg"]
  },
  {
    id: "v2",
    farmerId: "f2",
    farmerName: "Priya Sharma",
    documentType: "Organic Certification",
    submittedDate: "2024-02-12",
    status: "under_review",
    priority: "medium",
    documents: ["organic_cert_apeda.pdf", "practice_photos.zip"]
  },
  {
    id: "v3",
    farmerId: "f1",
    farmerName: "Ramesh Kumar",
    documentType: "Additional Credits Documentation",
    submittedDate: "2024-02-10",
    status: "verified",
    priority: "low",
    documents: ["new_practice_doc.pdf"],
    reviewedBy: "Admin User",
    reviewNotes: "All documents verified successfully",
    reviewDate: "2024-02-11"
  },
  {
    id: "v4",
    farmerId: "f4",
    farmerName: "Lakshmi Reddy",
    documentType: "Farm Expansion Documents",
    submittedDate: "2024-02-08",
    status: "rejected",
    priority: "medium",
    documents: ["expansion_plan.pdf", "satellite_images.zip"],
    reviewedBy: "Admin User",
    reviewNotes: "Additional documentation required - revenue records needed",
    reviewDate: "2024-02-09"
  }
];

// NEW: Company Requests for Marketplace
export const companyRequests: CompanyRequest[] = [
  {
    id: "cr1",
    companyId: "c1",
    companyName: "TCS Green Initiative",
    companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100",
    creditsNeeded: 1000,
    practiceType: ["Organic Farming", "No-Till Agriculture", "Agroforestry"],
    maxPricePerCredit: 2200,
    preferredStates: ["Maharashtra", "Karnataka", "Tamil Nadu"],
    deadline: "2024-03-15",
    description: "Looking for verified carbon credits from organic farming practices for Q1 2024 sustainability goals. Prefer farms in South & West India.",
    status: "open",
    postedDate: "2024-02-01",
    bidsCount: 12
  },
  {
    id: "cr2",
    companyId: "c2",
    companyName: "Reliance Industries Ltd",
    companyLogo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100",
    creditsNeeded: 2500,
    practiceType: ["Avoiding Stubble Burning", "Regenerative Agriculture"],
    maxPricePerCredit: 1900,
    preferredStates: ["Punjab", "Haryana", "Uttar Pradesh"],
    deadline: "2024-03-30",
    description: "Bulk purchase requirement for manufacturing carbon offset. Priority to farms with stubble burning prevention practices.",
    status: "open",
    postedDate: "2024-02-05",
    bidsCount: 8
  },
  {
    id: "cr3",
    companyId: "c3",
    companyName: "IndiGo Airlines",
    companyLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100",
    creditsNeeded: 5000,
    practiceType: ["Agroforestry", "Biodiversity Conservation", "Organic Farming"],
    maxPricePerCredit: 2500,
    preferredStates: ["All States"],
    deadline: "2024-04-20",
    description: "Large-scale carbon credit purchase for aviation sustainability compliance. Open to all verified eco-friendly practices across India.",
    status: "open",
    postedDate: "2024-02-10",
    bidsCount: 15
  },
  {
    id: "cr4",
    companyId: "c1",
    companyName: "TCS Green Initiative",
    companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100",
    creditsNeeded: 750,
    practiceType: ["Solar Irrigation", "Water Conservation"],
    maxPricePerCredit: 1800,
    preferredStates: ["Rajasthan", "Gujarat"],
    deadline: "2024-03-10",
    description: "Seeking credits from water conservation and solar-powered farming initiatives in water-scarce regions.",
    status: "in_progress",
    postedDate: "2024-01-20",
    bidsCount: 6
  }
];

// NEW: Farmer Bids
export const farmerBids: FarmerBid[] = [
  {
    id: "fb1",
    requestId: "cr1",
    farmerId: "f1",
    farmerName: "Ramesh Kumar",
    farmName: "Green Valley Organics",
    creditsOffered: 500,
    pricePerCredit: 2000,
    deliveryTime: "15 days",
    message: "We have verified organic farming credits ready for immediate transfer. Our farm is certified by APEDA.",
    status: "pending",
    submittedDate: "2024-02-02"
  },
  {
    id: "fb2",
    requestId: "cr1",
    farmerId: "f3",
    farmerName: "Arjun Singh",
    farmName: "Savanna Green Farms",
    creditsOffered: 800,
    pricePerCredit: 2100,
    deliveryTime: "10 days",
    message: "Premium agroforestry credits from Punjab. All documents verified. Can fulfill larger orders if needed.",
    status: "accepted",
    submittedDate: "2024-02-03"
  },
  {
    id: "fb3",
    requestId: "cr2",
    farmerId: "f2",
    farmerName: "Priya Sharma",
    farmName: "Sunrise Sustainable Farm",
    creditsOffered: 600,
    pricePerCredit: 1600,
    deliveryTime: "7 days",
    message: "Specialized in stubble management. Have been practicing this for 5+ years with full documentation.",
    status: "pending",
    submittedDate: "2024-02-06"
  }
];

export const platformStats = {
  totalCreditsTraded: 45780,
  activeFarmers: 1247,
  activeCompanies: 89,
  co2Offset: 45780,
  totalTransactionValue: 89250000,
  avgCreditPrice: 1950
};

export const testimonials = [
  {
    id: 1,
    name: "Ramesh Kumar",
    role: "Farmer, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    content: "This platform transformed my sustainable farming into real income. I've earned over ₹23 lakhs through carbon credits!",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Sustainability Director, TCS",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    content: "Finding verified Indian carbon credits used to take months. Now we meet our ESG goals in days with full transparency.",
    rating: 5
  },
  {
    id: 3,
    name: "Arjun Singh",
    role: "Farmer, Punjab",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    content: "The verification process is straightforward. My agroforestry credits now fund village education initiatives.",
    rating: 5
  }
];