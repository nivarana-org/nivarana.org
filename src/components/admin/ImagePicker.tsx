"use client";
import { getImages } from "@/network/api";
import { getImageURLFromFileName } from "@/utils/paths";
import { Box, Button, Grid, Modal } from "@mui/joy";
import { useEffect, useState } from "react";
import { uploadImage } from "./image";

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

    const handleUploadImage = async (file) => {
        setUploading(true);
        const data = await uploadImage(file);
        setSelected(data.filename);
        setImages(await getImages());
        setUploading(false);
    };
    return (
        <Modal open={!selected}>
            <Grid>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        height: "80%",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: 2,
                        overflow: "auto",
                    }}
                >
                    {uploading ? (
                        <div>Uploading...</div>
                    ) : (
                        <Button component="label">
                            Upload New Image
                            <input
                                onChange={(e) => {
                                    if (e.target.files === null) return;
                                    handleUploadImage(e.target.files[0]);
                                }}
                                type="file"
                                hidden
                            ></input>
                        </Button>
                    )}
                    {images
                        ? images?.map((i) => {
                              return (
                                  <Box
                                      key={i.filename}
                                      component="img"
                                      src={i.url}
                                      alt={`Image ${i.filename}`}
                                      sx={{
                                          width: "100%",
                                          height: "auto", // Maintain aspect ratio
                                          objectFit: "cover", // Fill the grid cell neatly
                                          borderRadius: 1, // Optional: Add rounded corners
                                      }}
                                      onClick={() => {
                                          setSelected(i.filename);
                                          onChange(i.filename);
                                      }}
                                  />
                              );
                          })
                        : null}
                </Box>
            </Grid>
        </Modal>
    );
}
