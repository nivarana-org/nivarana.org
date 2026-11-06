"use client";

import { Autocomplete, Box, TextField } from "@mui/material";

import type { MediaAuthorOption } from "@/types/media";

type Props = {
    authors: MediaAuthorOption[];
    value: number[];
    onChange: (authorIds: number[]) => void;
    label?: string;
    placeholder?: string;
    helperText?: string;
    size?: "small" | "medium";
    disabled?: boolean;
    limitTags?: number;
};

/**
 * Searchable multi-author picker. Options arrive from the API already sorted
 * by how often each author has been credited on media.
 */
export default function MediaAuthorSelect({
    authors,
    value,
    onChange,
    label = "Authors",
    placeholder = "Search authors",
    helperText,
    size = "medium",
    disabled = false,
    limitTags = 3,
}: Props) {
    const selectedAuthors = value
        .map((authorId) => authors.find((author) => author.id === authorId))
        .filter((author): author is MediaAuthorOption => Boolean(author));

    return (
        <Autocomplete
            multiple
            size={size}
            options={authors}
            value={selectedAuthors}
            disabled={disabled}
            limitTags={limitTags}
            onChange={(_event, newValue) => {
                onChange(newValue.map((author) => author.id));
            }}
            isOptionEqualToValue={(option, selected) =>
                option.id === selected.id
            }
            getOptionLabel={(option) => option.name}
            noOptionsText="No authors found"
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                    <Box
                        component="li"
                        key={key}
                        {...optionProps}
                        sx={{
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <span>{option.name}</span>
                        <Box
                            component="span"
                            sx={{ color: "text.secondary", fontSize: 12 }}
                        >
                            {option.mediaCount}{" "}
                            {option.mediaCount === 1 ? "image" : "images"}
                        </Box>
                    </Box>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    helperText={helperText}
                />
            )}
        />
    );
}
