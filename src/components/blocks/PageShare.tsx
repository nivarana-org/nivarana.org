"use client";
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    PinterestIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    TwitterIcon,
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
                <EmailIcon size={32} round={true}></EmailIcon>
            </EmailShareButton>
            <WhatsappShareButton htmlTitle="WhatsApp" url={url}>
                <WhatsappIcon size={32} round={true}></WhatsappIcon>
            </WhatsappShareButton>
            <TwitterShareButton htmlTitle="Twitter" url={url}>
                <TwitterIcon size={32} round={true}></TwitterIcon>
            </TwitterShareButton>
            <RedditShareButton htmlTitle="Reddit" url={url}>
                <RedditIcon size={32} round={true}></RedditIcon>
            </RedditShareButton>
            <FacebookShareButton htmlTitle="Facebook" url={url}>
                <FacebookIcon size={32} round={true}></FacebookIcon>
            </FacebookShareButton>
            <LinkedinShareButton htmlTitle="LinkedIn" url={url}>
                <LinkedinIcon size={32} round={true}></LinkedinIcon>
            </LinkedinShareButton>
            <PinterestShareButton htmlTitle="Pinterest" url={url} media={media}>
                <PinterestIcon size={32} round={true}></PinterestIcon>
            </PinterestShareButton>
            <TelegramShareButton htmlTitle="Telegram" url={url}>
                <TelegramIcon size={32} round={true}></TelegramIcon>
            </TelegramShareButton>
            <TumblrShareButton htmlTitle="Tumblr" url={url}>
                <TumblrIcon size={32} round={true}></TumblrIcon>
            </TumblrShareButton>
        </div>
    );
}
