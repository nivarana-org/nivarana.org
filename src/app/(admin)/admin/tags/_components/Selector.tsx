"use client";

import { Autocomplete } from "@mui/joy";
import { useState } from "react";

export default function Selector({ value, allTags, onChange }) {
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
        ></Autocomplete>
    );
}
