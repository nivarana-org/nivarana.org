import Image from "next/image"
import Link from "next/link"

export function NAuthorsBio({authors_data, author}) {
    if (authors_data) {
        return (<>
            { authors_data.map(a => <AuthorBio {...a} key={a.id}/>) }
        </>)
    } else {
        return (
            <AuthorBio {...author} />
        )
    }
}
export function AuthorBio({upload_image, path, author_name, description}) {
    return (
    <div className="about-author my-4 padding-30 rounded row">
        {upload_image != null && (
          <div className="col-md-2 col-sm-2 thumb d-flex justify-content-center align-items-center">
            <Image
              src={"https://blogsadmin.nivarana.org/images/" + upload_image}
              fill={true}
              className="author"
              alt="author"
            />
          </div>
        )}
        <div
          className={
            upload_image != null
              ? 'col-md-10 col-sm-10 details'
              : 'col-md-12 col-sm-12 details'
          }
        >
          <h4 className="name mb-0">
            <Link href={'/author/' + path}>
              {author_name}
            </Link>
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
    )
}