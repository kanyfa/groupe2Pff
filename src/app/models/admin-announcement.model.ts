export interface AdminAnnouncement {
    id: number;
    user: any;
    document: any;
    documentType: string;
    documentNumber: string;
    holderName: string;
    holderFirstName: string;
    title: string;
    description: string;
    lossDate: string;
    lossLocation: string;
    lossCity: string;
    lossPostalCode: string;
    rewardAmount: number;
    rewardDescription: string;
    status: string;
    urgent: boolean;
    contactPreference: string;
    contactPhone: string;
    contactEmail: string;
    imageUrl: string;
    expiresAt: string;
    resolvedAt: string;
    createdAt: string;
    updatedAt: string;
}