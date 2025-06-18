"use client";
import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import GoogleTranslateLogo from "../../../public/assets/google-translate.png";

interface PageTranslateProps {
    url: string;
}

const languages = [
    { code: "hi", name: "हिन्दी" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "ml", name: "മലയാളം" },
    { code: "mr", name: "मराठी" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "pa", name: "ਪੰਜਾਬੀ" },
    { code: "bn", name: "বাংলা" },
    { code: "as", name: "অসমীয়া" },
    { code: "or", name: "ଓଡ଼ିଆ" },
    { code: "ma", name: "मणिपुरी" },
    { code: "sa", name: "संस्कृतम्" },
    { code: "ks", name: "کٲشُر" },
    { code: "ne", name: "नेपाली" },
    { code: "sd", name: "سنڌي" },
    { code: "si", name: "සිංහල" },
    { code: "ur", name: "اردو" },
    { code: "bo", name: "བོད་སྐད་" },
    { code: "doi", name: "डोगरी" },
    // { code: "mni", name: "মৈতৈলোন্" },
    // { code: "bodo", name: "बर'" }
];

const PageTranslate: React.FC<PageTranslateProps> = ({ url }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageClick = (languageCode: string) => {
        const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${languageCode}&u=${encodeURIComponent(url)}`;
        window.open(translateUrl, "_blank");
        handleClose();
    };

    return (
        <div>
            <IconButton onClick={handleClick}>
                <GoogleTranslateIcon></GoogleTranslateIcon>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {languages.map((language) => (
                    <MenuItem
                        key={language.code}
                        onClick={() => handleLanguageClick(language.code)}
                    >
                        {language.name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default PageTranslate;

const GoogleTranslateIcon = () => {
    return (
        <Image
            alt="logo of google translate"
            width="30"
            height="30"
            src={GoogleTranslateLogo}
        ></Image>
    );
};
