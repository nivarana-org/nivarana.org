import type { Metadata } from "next";
import { getSettings } from "@/data/cms";
import { StorePage } from "@/components/store/StorePage";
import type { StoreData, StorePoster } from "@/types/store";

export const metadata: Metadata = {
    title: "Store",
    description:
        "Exclusive Nivarana posters — art and essays you can hold. Available in A6, A4, and A3 sizes.",
    alternates: {
        canonical: "https://nivarana.org/store",
    },
};

export const dynamic = "force-dynamic";

async function getStoreData(): Promise<StoreData> {
    const settings = await getSettings([
        "store.enabled",
        "store.razorpay_url",
        "store.posters",
    ]);

    let posters: StorePoster[] = [];
    try {
        const raw = settings["store.posters"];
        if (raw) {
            const parsed =
                typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
            if (Array.isArray(parsed)) posters = parsed as StorePoster[];
        }
    } catch (err) {
        console.error(err);
    }

    return {
        enabled:
            settings["store.enabled"] === "1" ||
            settings["store.enabled"] === "true",
        razorpayUrl: settings["store.razorpay_url"],
        posters,
    };
}

export default async function Page() {
    const store = await getStoreData();

    return <StorePage store={store} />;
}
