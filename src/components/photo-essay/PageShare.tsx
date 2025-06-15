"use client";
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    PocketShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    PinterestIcon,
    PocketIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";

export default function PageShare({
    url,
    media,
}: {
    url: string;
    media: string;
}) {
    return (
        <div className="flex gap-1">
            <EmailShareButton url={url}>
                <EmailIcon size={32} round={true}></EmailIcon>
            </EmailShareButton>
            <WhatsappShareButton url={url}>
                <WhatsappIcon size={32} round={true}></WhatsappIcon>
            </WhatsappShareButton>
            <TwitterShareButton url={url}>
                <TwitterIcon size={32} round={true}></TwitterIcon>
            </TwitterShareButton>
            <RedditShareButton url={url}>
                <RedditIcon size={32} round={true}></RedditIcon>
            </RedditShareButton>
            <FacebookShareButton url={url}>
                <FacebookIcon size={32} round={true}></FacebookIcon>
            </FacebookShareButton>
            <LinkedinShareButton url={url}>
                <LinkedinIcon size={32} round={true}></LinkedinIcon>
            </LinkedinShareButton>
            <PinterestShareButton url={url} media={media}>
                <PinterestIcon size={32} round={true}></PinterestIcon>
            </PinterestShareButton>
            <PocketShareButton url={url}>
                <PocketIcon size={32} round={true}></PocketIcon>
            </PocketShareButton>
            <TelegramShareButton url={url}>
                <TelegramIcon size={32} round={true}></TelegramIcon>
            </TelegramShareButton>
            <TumblrShareButton url={url}>
                <TumblrIcon size={32} round={true}></TumblrIcon>
            </TumblrShareButton>
        </div>
    );
}
