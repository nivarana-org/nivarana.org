'use client'

import { useEffect, useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {
    const [quote, setQuote] = useState<{quote: string, author: string}>();

    useEffect(() => {
        fetch('https://quotes-api-self.vercel.app/quote')
            .then(d => d.json())
            .then(q => setQuote(q));
    }, [])

    if (!quote) return;

    return <div className="max-w-prose mx-auto">
        <h1>&quot;{quote?.quote}&quot;</h1>
        <h2 className="ml-40">{quote?.author}</h2>
    </div>
}