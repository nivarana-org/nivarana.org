import Link from "next/link";
import Image from "next/image";

import { getCategories, getSubscriberName } from "../../queries";

import styles from "./header.module.css";
import logo from "../../../../../public/assets/logo.png";
import MenuCloser from "./MenuCloser";
import SearchForm from "./SearchForm";
import { NAV_TOGGLE_ID } from "./types";

type Category = Awaited<ReturnType<typeof getCategories>>[number];

/*
    Category links do double duty: cards inside the collapsible menu on small
    screens, and the plain strip of the category layer on large screens.
*/
const categoryLink =
    "block rounded-md bg-white px-4 py-2 font-heading uppercase shadow-sm transition-all hover:text-nivarana-green lg:bg-transparent lg:shadow-none lg:hover:scale-110";

const desktopUtilityLink =
    "px-4 py-2 font-heading uppercase transition-all hover:text-nivarana-green hover:scale-110";

function Logo() {
    return (
        <Link href="/" className={styles.logo}>
            <Image
                src={logo}
                alt="Nivarana Logo"
                className="h-12 w-auto lg:h-14"
                width={590}
                height={417}
            />
        </Link>
    );
}

/** Search, हिंदी and the subscriber link of the utility layer. */
function DesktopUtilities({ name }: { name: string | null }) {
    return (
        <div
            className={`${styles.utilities} hidden items-center gap-2 lg:flex`}
        >
            <SearchForm id="header-search" className="w-40 xl:w-56" />
            <Link href="/hindi" className={desktopUtilityLink}>
                हिंदी
            </Link>
            {name ? (
                <Link
                    href="/profile"
                    className="max-w-40 truncate rounded-md border border-nivarana-charcoal/30 px-4 py-1.5 font-heading transition-colors hover:border-nivarana-blue hover:text-nivarana-blue"
                >
                    {name}
                </Link>
            ) : (
                <Link
                    href="/subscribe"
                    className="rounded-md bg-nivarana-blue px-4 py-1.5 font-heading uppercase text-white shadow-sm transition-opacity hover:opacity-90"
                >
                    Subscribe
                </Link>
            )}
        </div>
    );
}

/** The same utilities, as cards inside the collapsible menu. */
function MobileUtilities({ name }: { name: string | null }) {
    return (
        <ul className="container mx-auto flex flex-col gap-2 px-4 py-3 lg:hidden">
            <li>
                <SearchForm id="header-search-mobile" className="w-full" />
            </li>
            <li>
                <Link href="/hindi" className={categoryLink}>
                    हिंदी
                </Link>
            </li>
            <li>
                {name ? (
                    <Link href="/profile" className={categoryLink}>
                        {name}
                    </Link>
                ) : (
                    <Link
                        href="/subscribe"
                        className="block rounded-md bg-nivarana-blue px-4 py-2 font-heading uppercase text-white shadow-sm transition-opacity hover:opacity-90"
                    >
                        Subscribe
                    </Link>
                )}
            </li>
        </ul>
    );
}

function CategoryLinks({ categories }: { categories: Category[] }) {
    return (
        <ul
            className={`${styles.categories} container mx-auto flex flex-col gap-2 px-4 pb-3 lg:flex-row lg:items-center lg:gap-2 lg:py-2`}
        >
            {categories.map((c) => (
                <li key={c.slug}>
                    <Link href={`/category/${c.slug}`} className={categoryLink}>
                        {c.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default async function Header() {
    const [categories, subscriberName] = await Promise.all([
        getCategories(),
        getSubscriberName(),
    ]);

    return (
        <header className={`${styles.header} shadow-md`}>
            {/* Layer 1: logo and utilities */}
            <div className="border-b border-nivarana-charcoal/20">
                <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-2.5">
                    <Logo />
                    <DesktopUtilities name={subscriberName} />
                    <div className="lg:hidden">
                        <input
                            type="checkbox"
                            id={NAV_TOGGLE_ID}
                            className={styles.toggle}
                        />
                        <label
                            htmlFor={NAV_TOGGLE_ID}
                            className={styles.hamburger}
                        >
                            <span className="sr-only">Menu</span>
                            <span
                                className={`${styles.line} ${styles.lineTop}`}
                            />
                            <span
                                className={`${styles.line} ${styles.lineMiddle}`}
                            />
                            <span
                                className={`${styles.line} ${styles.lineBottom}`}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Layer 2: categories, collapsible on small screens */}
            <MenuCloser>
                <nav className={styles.menu} aria-label="Main navigation">
                    <div className={styles.menuInner}>
                        <MobileUtilities name={subscriberName} />
                        <CategoryLinks categories={categories} />
                    </div>
                </nav>
            </MenuCloser>
        </header>
    );
}
