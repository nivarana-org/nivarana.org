import { getImageURLFromFileName } from "@/utils/paths";
import Image from "next/image";
import Link from "next/link";

export function NAuthorsBio({ authors }) {
    return (
        <>
            {authors.map((a) => (
                <AuthorBio {...a} key={a.id} />
            ))}
        </>
    );
}
export function AuthorBio({ image, path, name, description }) {
    const showImage = false;
    return (
        <div className="about-author my-4 padding-30 rounded-sm row">
            {image != null && showImage && (
                <div className="col-md-2 col-sm-2 thumb d-flex justify-content-center align-items-center">
                    <Image
                        src={getImageURLFromFileName(image)}
                        fill={true}
                        className="author"
                        alt="author"
                    />
                </div>
            )}
            <div
                className={
                    image != null
                        ? "col-md-10 col-sm-10 details"
                        : "col-md-12 col-sm-12 details"
                }
            >
                <h4 className="name mb-0">
                    <Link href={"/author/" + path}>{name}</Link>
                </h4>
                {description != null && (
                    <div
                        className="mt-2"
                        dangerouslySetInnerHTML={{
                            __html: description,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
