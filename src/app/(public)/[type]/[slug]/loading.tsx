export default function Loading() {
    return (
        <div className="max-w-screen-xl mx-auto py-8 px-4 animate-pulse">
            <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 w-full bg-gray-200 rounded mb-8"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        </div>
    );
}
