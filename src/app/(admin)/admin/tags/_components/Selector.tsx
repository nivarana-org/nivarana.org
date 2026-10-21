"use client";

import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

import type { Tag } from "../queries";

export default function Selector({
    value,
    allTags,
    onChange,
}: {
    value: Tag[];
    allTags: Tag[];
    onChange: (tags: number[]) => void | Promise<void>;
}) {
    const [displayedValue, setDisplayedValue] = useState(value);
    return (
        <Autocomplete
            multiple
            value={displayedValue}
            onChange={(e, newValue) => {
                setDisplayedValue(newValue);
                onChange(newValue.map((t) => t.id));
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={allTags}
            getOptionLabel={(o) => o.name}
            renderInput={(params) => <TextField {...params} />}
        ></Autocomplete>
    );
}
