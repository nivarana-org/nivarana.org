"use client";
import Typography from "@mui/joy/Typography";

import { useState } from "react";

export default function BodyWithPopover({ body }: { body: string }) {
    const [selectedDefinition, setSelectedDefinition] = useState<string | null>(
        null,
    );
    return (
        <>
            <div
                className="post-content mt-4 font-sans text-lg p-2"
                dangerouslySetInnerHTML={{ __html: body }}
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName.toLowerCase() === "dfn") {
                        setSelectedDefinition(
                            `${target.innerHTML}: ${target.getAttribute("title")}`,
                        );
                    } else {
                        setSelectedDefinition(null);
                    }
                }}
            ></div>
            {selectedDefinition && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#f8f9fa",
                        padding: "16px",
                        borderTop: "2px solid #007bff",
                        textAlign: "center",
                        zIndex: 1000,
                    }}
                >
                    <Typography fontSize="sm">{selectedDefinition}</Typography>
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={e => setSelectedDefinition(null)}
                    >
                        X
                    </div>
                </div>
            )}
        </>
    );
}
