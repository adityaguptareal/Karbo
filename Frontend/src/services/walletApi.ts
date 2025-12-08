import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export interface WalletTransaction {
    _id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    createdAt: string;
    transactionId?: {
        companyId?: {
            name: string;
            email: string;
        };
        creditsPurchased?: number;
        amountPaid?: number;
        carbonCreditListingId?: {
            pricePerCredit: number;
            totalCredits: number;
        }
    };
}

export interface WalletData {
    balance: number;
    transactions: WalletTransaction[];
}

export const walletApi = {
    getWalletDetails: async (): Promise<WalletData> => {
        const response = await axios.get(`${API_URL}/wallet`, getAuthHeader());
        return response.data;
    },
};
