import api from "@/shared/services/apiService";

export type CreditPackage = {
    id: string;
    credits: number;
    price: number;   // em centavos
    label: string;
    tag: string | null;
    popular: boolean;
    recommended?: boolean;
    description?: string;
};

export type CreditStatus = {
    balance: number;
    logs: { id: string; type: string; amount: number; note: string; createdAt: string }[];
    images: { id: string; image_mood: string; sentiment: string; moodScore: number; analyzedAt: string }[];
    packages: CreditPackage[];
};

export async function getCreditStatus(): Promise<CreditStatus> {
    return api.get("/credits/status").then(r => r.data);
}

export async function getCreditBalance(): Promise<{ balance: number }> {
    return api.get("/credits/balance").then(r => r.data);
}

export async function purchasePackage(packageId: string, source = "credit_modal"): Promise<{ balance: number }> {
    return api.post("/credits/purchase", { packageId, source }).then(r => r.data);
}
