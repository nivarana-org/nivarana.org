"use client";

import { Autocomplete, TextField } from "@mui/material";

type Person = {
    id: number;
    name: string;
};

type Props = {
    people: Person[];
    value: number[];
    onChange: (ids: number[]) => void;
    label: string;
    helperText?: string;
};

/**
 * A searchable multi-person picker. Authors and editors are both stored in the
 * authors table, so they share the same options and selection behaviour.
 */
export default function PersonSelect({
    people,
    value,
    onChange,
    label,
    helperText,
}: Props) {
    const selectedPeople = people.filter((person) => value.includes(person.id));

    return (
        <Autocomplete
            multiple
            options={people}
            value={selectedPeople}
            onChange={(_event, newValue) => {
                onChange(newValue.map((person) => person.id));
            }}
            isOptionEqualToValue={(option, selected) =>
                option.id === selected.id
            }
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) => option.name}
            noOptionsText="No people found"
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder="Search people"
                    helperText={helperText}
                />
            )}
        />
    );
}
