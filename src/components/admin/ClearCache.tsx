"use client"

import { Button } from "@mui/joy"

export default function ClearCache({clearCache}: {clearCache: () => void}) {
    return <Button onClick={async () => {
        clearCache()
    }}>Clear Cache</Button>
}