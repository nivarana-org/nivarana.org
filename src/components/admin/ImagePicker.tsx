"use client";
import { getImages } from "@/network/api";
import { getImageURLFromFileName } from "@/utils/paths";
import { Box, Button, Grid } from "@mui/joy";
import { useEffect, useState } from "react";

export default function ImagePicker({
    defaultValue,
    onChange,
}: {
    defaultValue: string;
    onChange: (string) => void;
}) {
    const [selected, setSelected] = useState(defaultValue);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<{ filename: string; url: string }[]>(
        [],
    );
    useEffect(() => {
        (async () => {
            const images = await getImages();
            setImages(images);
        })();
    }, []);
    if (selected)
        return (
            <Grid>
                <img
                    alt="Representative image"
                    src={getImageURLFromFileName(selected)}
                    height={100}
                    width={100}
                ></img>
                <button onClick={() => setSelected("")}>Remove/Change</button>
            </Grid>
        );

    const uploadImage = async (file) => {
        setUploading(true);
        console.log(file);
        const formData = new FormData();
        formData.append("file", file, file.name);
        const result = await fetch("/admin/api/images/upload", {
            body: formData,
            method: "post",
        });
        const data = await result.json();
        setSelected(data.filename);
        setImages(await getImages());
        setUploading(false);
    };
    if (uploading) return <div>Uploading...</div>;
    return (
        <Grid>
            <Button variant="contained" component="label">
                Upload New Image
                <input
                    onChange={(e) => {
                        if (e.target.files === null) return;
                        uploadImage(e.target.files[0]);
                    }}
                    type="file"
                    hidden
                ></input>
            </Button>
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    py: 1,
                    overflow: "auto",
                    width: "100%",
                    scrollSnapType: "x mandatory",
                    "& > *": {
                        scrollSnapAlign: "center",
                    },
                    "::-webkit-scrollbar": { display: "none" },
                }}
            >
                {images
                    ? images?.map((i) => {
                          return (
                              <img
                                  key={i.filename}
                                  src={i.url}
                                  height={55}
                                  width={80}
                                  onClick={() => {
                                      setSelected(i.filename);
                                      onChange(i.filename);
                                  }}
                              ></img>
                          );
                      })
                    : null}
            </Box>
        </Grid>
    );
}
