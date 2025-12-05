export interface Farmer {
  id: string;
  name: string;
  farmName: string;
  location: string;
  country: string;
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
  country: string;
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
}

export const farmers: Farmer[] = [
  {
    id: "f1",
    name: "Maria Santos",
    farmName: "Green Valley Organics",
    location: "São Paulo",
    country: "Brazil",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
    practices: ["Organic Farming", "No-Till Agriculture", "Crop Rotation"],
    totalCredits: 2450,
    creditsAvailable: 1200,
    creditsSold: 1250,
    rating: 4.9,
    verified: true,
    joinedDate: "2023-03-15",
    farmSize: "450 hectares"
  },
  {
    id: "f2",
    name: "Raj Patel",
    farmName: "Sunrise Sustainable Farm",
    location: "Gujarat",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    practices: ["Avoiding Stubble Burning", "Organic Fertilizers", "Water Conservation"],
    totalCredits: 1890,
    creditsAvailable: 890,
    creditsSold: 1000,
    rating: 4.7,
    verified: true,
    joinedDate: "2023-05-22",
    farmSize: "320 hectares"
  },
  {
    id: "f3",
    name: "John Kimani",
    farmName: "Savanna Green Farms",
    location: "Nairobi",
    country: "Kenya",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    practices: ["Agroforestry", "Organic Farming", "Biodiversity Conservation"],
    totalCredits: 3200,
    creditsAvailable: 1800,
    creditsSold: 1400,
    rating: 4.8,
    verified: true,
    joinedDate: "2022-11-08",
    farmSize: "680 hectares"
  },
  {
    id: "f4",
    name: "Emma Wilson",
    farmName: "Prairie Wind Ranch",
    location: "Montana",
    country: "USA",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    practices: ["Regenerative Grazing", "Cover Crops", "No-Till Agriculture"],
    totalCredits: 1560,
    creditsAvailable: 560,
    creditsSold: 1000,
    rating: 4.6,
    verified: true,
    joinedDate: "2023-01-20",
    farmSize: "1200 hectares"
  },
  {
    id: "f5",
    name: "Chen Wei",
    farmName: "Harmony Fields",
    location: "Yunnan",
    country: "China",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    practices: ["Terraced Farming", "Organic Tea Cultivation", "Soil Restoration"],
    totalCredits: 980,
    creditsAvailable: 480,
    creditsSold: 500,
    rating: 4.5,
    verified: false,
    joinedDate: "2023-08-12",
    farmSize: "150 hectares"
  },
  {
    id: "f6",
    name: "Isabella Rodriguez",
    farmName: "Tierra Verde Estate",
    location: "Mendoza",
    country: "Argentina",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    practices: ["Organic Vineyards", "Solar Irrigation", "Biodiversity Corridors"],
    totalCredits: 2100,
    creditsAvailable: 1100,
    creditsSold: 1000,
    rating: 4.9,
    verified: true,
    joinedDate: "2022-09-05",
    farmSize: "380 hectares"
  }
];

export const carbonCredits: CarbonCredit[] = [
  {
    id: "cc1",
    farmerId: "f1",
    farmerName: "Maria Santos",
    farmName: "Green Valley Organics",
    location: "São Paulo",
    country: "Brazil",
    practiceType: "Organic Farming",
    credits: 500,
    pricePerCredit: 18.50,
    verified: true,
    verificationDate: "2024-01-15",
    co2Offset: 500,
    description: "Premium organic farming credits from certified sustainable practices in the Brazilian highlands.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400"
  },
  {
    id: "cc2",
    farmerId: "f1",
    farmerName: "Maria Santos",
    farmName: "Green Valley Organics",
    location: "São Paulo",
    country: "Brazil",
    practiceType: "No-Till Agriculture",
    credits: 350,
    pricePerCredit: 22.00,
    verified: true,
    verificationDate: "2024-01-20",
    co2Offset: 350,
    description: "No-till farming credits preserving soil carbon and reducing emissions.",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400"
  },
  {
    id: "cc3",
    farmerId: "f2",
    farmerName: "Raj Patel",
    farmName: "Sunrise Sustainable Farm",
    location: "Gujarat",
    country: "India",
    practiceType: "Avoiding Stubble Burning",
    credits: 600,
    pricePerCredit: 15.00,
    verified: true,
    verificationDate: "2024-02-01",
    co2Offset: 600,
    description: "Credits generated from stubble retention practices, preventing harmful air pollution.",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400"
  },
  {
    id: "cc4",
    farmerId: "f3",
    farmerName: "John Kimani",
    farmName: "Savanna Green Farms",
    location: "Nairobi",
    country: "Kenya",
    practiceType: "Agroforestry",
    credits: 800,
    pricePerCredit: 25.00,
    verified: true,
    verificationDate: "2024-01-28",
    co2Offset: 800,
    description: "High-quality agroforestry credits combining tree planting with sustainable agriculture.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
  },
  {
    id: "cc5",
    farmerId: "f3",
    farmerName: "John Kimani",
    farmName: "Savanna Green Farms",
    location: "Nairobi",
    country: "Kenya",
    practiceType: "Biodiversity Conservation",
    credits: 450,
    pricePerCredit: 28.00,
    verified: true,
    verificationDate: "2024-02-05",
    co2Offset: 450,
    description: "Premium credits supporting wildlife corridors and native species preservation.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400"
  },
  {
    id: "cc6",
    farmerId: "f4",
    farmerName: "Emma Wilson",
    farmName: "Prairie Wind Ranch",
    location: "Montana",
    country: "USA",
    practiceType: "Regenerative Grazing",
    credits: 400,
    pricePerCredit: 20.00,
    verified: true,
    verificationDate: "2024-01-10",
    co2Offset: 400,
    description: "Regenerative ranching credits improving soil health and sequestering carbon.",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400"
  },
  {
    id: "cc7",
    farmerId: "f5",
    farmerName: "Chen Wei",
    farmName: "Harmony Fields",
    location: "Yunnan",
    country: "China",
    practiceType: "Organic Tea Cultivation",
    credits: 250,
    pricePerCredit: 19.50,
    verified: false,
    verificationDate: "",
    co2Offset: 250,
    description: "Sustainable tea farming credits from ancient terraced highlands.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400"
  },
  {
    id: "cc8",
    farmerId: "f6",
    farmerName: "Isabella Rodriguez",
    farmName: "Tierra Verde Estate",
    location: "Mendoza",
    country: "Argentina",
    practiceType: "Solar Irrigation",
    credits: 550,
    pricePerCredit: 17.00,
    verified: true,
    verificationDate: "2024-02-10",
    co2Offset: 550,
    description: "Credits from solar-powered vineyard irrigation reducing energy consumption.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
  }
];

export const companies: Company[] = [
  {
    id: "c1",
    name: "EcoTech Solutions",
    industry: "Technology",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100",
    totalPurchased: 2500,
    totalSpent: 52500,
    co2Offset: 2500
  },
  {
    id: "c2",
    name: "Green Manufacturing Co.",
    industry: "Manufacturing",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100",
    totalPurchased: 5000,
    totalSpent: 95000,
    co2Offset: 5000
  },
  {
    id: "c3",
    name: "Sustainable Airlines",
    industry: "Aviation",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100",
    totalPurchased: 15000,
    totalSpent: 285000,
    co2Offset: 15000
  }
];

export const transactions: Transaction[] = [
  { id: "t1", type: "sale", amount: 925, credits: 50, date: "2024-02-15", status: "completed", description: "Sold to EcoTech Solutions" },
  { id: "t2", type: "sale", amount: 1850, credits: 100, date: "2024-02-10", status: "completed", description: "Sold to Green Manufacturing" },
  { id: "t3", type: "withdrawal", amount: 2000, date: "2024-02-08", status: "completed", description: "Bank transfer" },
  { id: "t4", type: "sale", amount: 462.50, credits: 25, date: "2024-02-01", status: "completed", description: "Sold to Sustainable Airlines" },
  { id: "t5", type: "sale", amount: 555, credits: 30, date: "2024-01-28", status: "pending", description: "Pending verification" },
  { id: "t6", type: "withdrawal", amount: 1500, date: "2024-01-20", status: "completed", description: "Bank transfer" },
];

export const verificationRequests: VerificationRequest[] = [
  {
    id: "v1",
    farmerId: "f5",
    farmerName: "Chen Wei",
    documentType: "Land Ownership",
    submittedDate: "2024-02-14",
    status: "pending",
    priority: "high",
    documents: ["land_deed.pdf", "property_map.jpg"]
  },
  {
    id: "v2",
    farmerId: "f2",
    farmerName: "Raj Patel",
    documentType: "Eco-Practice Certification",
    submittedDate: "2024-02-12",
    status: "under_review",
    priority: "medium",
    documents: ["organic_cert.pdf", "practice_photos.zip"]
  },
  {
    id: "v3",
    farmerId: "f1",
    farmerName: "Maria Santos",
    documentType: "Additional Credits",
    submittedDate: "2024-02-10",
    status: "verified",
    priority: "low",
    documents: ["new_practice_doc.pdf"]
  },
  {
    id: "v4",
    farmerId: "f4",
    farmerName: "Emma Wilson",
    documentType: "Farm Expansion",
    submittedDate: "2024-02-08",
    status: "rejected",
    priority: "medium",
    documents: ["expansion_plan.pdf", "satellite_images.zip"]
  }
];

export const platformStats = {
  totalCreditsTraded: 45780,
  activeFarmers: 1247,
  activeCompanies: 89,
  co2Offset: 45780,
  totalTransactionValue: 892500,
  avgCreditPrice: 19.50
};

export const testimonials = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Farmer, Brazil",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
    content: "This platform transformed my sustainable farming practices into a real income stream. I've earned over $23,000 in carbon credits while doing what I love.",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Sustainability Director, TechCorp",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    content: "Finding verified carbon credits used to take months. Now we can meet our sustainability goals in days with full transparency and compliance reports.",
    rating: 5
  },
  {
    id: 3,
    name: "John Kimani",
    role: "Farmer, Kenya",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    content: "The verification process is straightforward and fair. My agroforestry credits now fund local education initiatives in my community.",
    rating: 5
  }
];
