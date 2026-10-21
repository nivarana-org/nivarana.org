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
import type { ReactNode } from "react";

/**
 * `react-share` styles its buttons inline, so the round, hoverable surface is
 * drawn by a wrapper around each button rather than by the button itself.
 */
const ICON_WRAPPER =
    "flex h-10 w-10 items-center justify-center rounded-full text-nivarana-charcoal transition-colors duration-200 hover:bg-nivarana-white/50";

const ShareIcon = ({ children }: { children: ReactNode }) => (
    <span className={ICON_WRAPPER}>{children}</span>
);

export default function PageShare({
    url,
    media,
    style,
    className = "",
}: {
    url: string;
    media: string;
    style?: "vertical" | "horizontal";
    className?: string;
}) {
    const layout =
        style === "vertical"
            ? "flex flex-col items-center gap-3"
            : "flex flex-wrap items-center justify-start gap-2 md:justify-center";
    return (
        <div className={`${layout} ${className}`.trim()}>
            <EmailShareButton htmlTitle="Email" url={url}>
                <ShareIcon>
                    <EmailIcon size={28}></EmailIcon>
                </ShareIcon>
            </EmailShareButton>
            <WhatsappShareButton htmlTitle="WhatsApp" url={url}>
                <ShareIcon>
                    <WhatsappIcon size={28}></WhatsappIcon>
                </ShareIcon>
            </WhatsappShareButton>
            <XShareButton htmlTitle="Twitter" url={url}>
                <ShareIcon>
                    <XIcon size={28}></XIcon>
                </ShareIcon>
            </XShareButton>
            <RedditShareButton htmlTitle="Reddit" url={url}>
                <ShareIcon>
                    <RedditIcon size={28}></RedditIcon>
                </ShareIcon>
            </RedditShareButton>
            <FacebookShareButton htmlTitle="Facebook" url={url}>
                <ShareIcon>
                    <FacebookIcon size={28}></FacebookIcon>
                </ShareIcon>
            </FacebookShareButton>
            <LinkedinShareButton htmlTitle="LinkedIn" url={url}>
                <ShareIcon>
                    <LinkedinIcon size={28}></LinkedinIcon>
                </ShareIcon>
            </LinkedinShareButton>
            <PinterestShareButton htmlTitle="Pinterest" url={url} media={media}>
                <ShareIcon>
                    <PinterestIcon size={28}></PinterestIcon>
                </ShareIcon>
            </PinterestShareButton>
            <TelegramShareButton htmlTitle="Telegram" url={url}>
                <ShareIcon>
                    <TelegramIcon size={28}></TelegramIcon>
                </ShareIcon>
            </TelegramShareButton>
            <TumblrShareButton htmlTitle="Tumblr" url={url}>
                <ShareIcon>
                    <TumblrIcon size={28}></TumblrIcon>
                </ShareIcon>
            </TumblrShareButton>
        </div>
    );
}
