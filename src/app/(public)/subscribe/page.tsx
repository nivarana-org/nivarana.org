import { getAllPlans } from "@/data/subscriptions";
import Link from "next/link";

export default async function Page() {
    const [allPlans] = await Promise.all([getAllPlans(true)]);

    const plans = allPlans.map((plan) => ({
        price: plan.price,
        name: plan.name,
        features: JSON.parse(plan.features || "[]") as string[],
    }));

    const visiblePlans = plans.filter(
        (plan) =>
            allPlans.find((p) => p.price === plan.price)?.show_in_ui === 1,
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 text-center">
                Contribute to Nivarana
            </h1>

            <section id="membership" className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Membership Plans
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Support Nivarana and unlock exclusive features.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.price}
                            className="border border-gray-200 rounded-lg p-4 flex flex-col"
                        >
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-gray-900">
                                    ₹{plan.price}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    /month
                                </span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                                {plan.name}
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-1 flex-grow">
                                {plan.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2"
                                    >
                                        <svg
                                            className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={"/profile#membership"}
                                className={`mt-4 w-full px-4 py-2 rounded-md text-sm font-medium bg-nivarana-blue text-white hover:bg-nivarana-blue/90 disabled:opacity-50`}
                            >
                                Subscribe
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
