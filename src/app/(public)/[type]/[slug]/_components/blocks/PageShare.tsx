"use client";
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    XShareButton,
    WhatsappShareButton,
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    PinterestIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    XIcon,
    WhatsappIcon,
} from "react-share";

export default function PageShare({
    url,
    media,
    style,
}: {
    url: string;
    media: string;
    style?: "vertical" | "horizontal";
}) {
    const classes =
        style === "vertical"
            ? "p-2 max-w-10"
            : "p-2 flex flex-wrap justify-start md:justify-center gap-1";
    return (
        <div className={classes}>
            <EmailShareButton htmlTitle="Email" url={url}>
                <EmailIcon size={32}></EmailIcon>
            </EmailShareButton>
            <WhatsappShareButton htmlTitle="WhatsApp" url={url}>
                <WhatsappIcon size={32}></WhatsappIcon>
            </WhatsappShareButton>
            <XShareButton htmlTitle="Twitter" url={url}>
                <XIcon size={32}></XIcon>
            </XShareButton>
            <RedditShareButton htmlTitle="Reddit" url={url}>
                <RedditIcon size={32}></RedditIcon>
            </RedditShareButton>
            <FacebookShareButton htmlTitle="Facebook" url={url}>
                <FacebookIcon size={32}></FacebookIcon>
            </FacebookShareButton>
            <LinkedinShareButton htmlTitle="LinkedIn" url={url}>
                <LinkedinIcon size={32}></LinkedinIcon>
            </LinkedinShareButton>
            <PinterestShareButton htmlTitle="Pinterest" url={url} media={media}>
                <PinterestIcon size={32}></PinterestIcon>
            </PinterestShareButton>
            <TelegramShareButton htmlTitle="Telegram" url={url}>
                <TelegramIcon size={32}></TelegramIcon>
            </TelegramShareButton>
            <TumblrShareButton htmlTitle="Tumblr" url={url}>
                <TumblrIcon size={32}></TumblrIcon>
            </TumblrShareButton>
        </div>
    );
}
