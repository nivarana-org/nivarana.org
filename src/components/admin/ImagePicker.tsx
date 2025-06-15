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
    const [open, setOpen] = useState(false);
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
    if (!open)
        return (
            <Grid>
                {selected ? (
                    <img
                        alt={`Representative image named ${selected}`}
                        src={getImageURLFromFileName(selected)}
                        height="50vh"
                    ></img>
                ) : (
                    <div>No image selected</div>
                )}
                <Button onClick={() => setOpen(true)}>Change</Button>
            </Grid>
        );

    const handleUploadImage = async (file) => {
        setUploading(true);
        const data = await uploadImage(file);
        setSelected(data.filename);
        setOpen(false);
        onChange(data.filename);
        setImages(await getImages());
        setUploading(false);
    };
    return (
        <Modal open={open}>
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
                                      src={getImageURLFromFileName(i.filename)}
                                      alt={`Image ${i.filename}`}
                                      sx={{
                                          width: "100%",
                                          height: "auto", // Maintain aspect ratio
                                          objectFit: "cover", // Fill the grid cell neatly
                                          borderRadius: 1, // Optional: Add rounded corners
                                      }}
                                      onClick={() => {
                                          setSelected(i.filename);
                                          setOpen(false);
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
