export interface StorePoster {
    id: string;
    title: string;
    description: string;
    imagePaths: string[];
    sizes: string[];
}

export interface StoreData {
    enabled: boolean;
    razorpayUrl: string | null;
    posters: StorePoster[];
}
