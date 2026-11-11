import SearchIcon from "./SearchButton";

type Props = {
    /** Unique id for the input; the header renders this form twice. */
    id: string;
    className?: string;
};

/**
 * A plain GET form to the search page - fully server-rendered, no client
 * JavaScript involved.
 */
export default function SearchForm({ id, className = "" }: Props) {
    return (
        <form
            action="/search"
            method="get"
            className={`relative flex ${className}`}
        >
            <label htmlFor={id} className="sr-only">
                Search articles
            </label>
            <input
                id={id}
                name="q"
                type="search"
                placeholder="Search articles"
                autoComplete="off"
                className="peer block w-full rounded-md border border-nivarana-charcoal/30 bg-white py-1.5 pl-9 pr-3 text-sm text-nivarana-charcoal placeholder:text-nivarana-charcoal/50 focus:outline-2 focus:outline-nivarana-blue"
            />
            <button
                type="submit"
                aria-label="Search"
                className="absolute left-1 top-1/2 -translate-y-1/2 rounded p-1 text-nivarana-charcoal/60 transition-colors hover:text-nivarana-blue peer-focus:text-nivarana-blue"
            >
                <SearchIcon className="h-4 w-4" />
            </button>
        </form>
    );
}
