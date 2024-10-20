import Link from "next/link"

export function Author({ path, author_name }) {
    return <li className="list-inline-item">
        <Link href={'/author/' + path}>
            {/* {upload_image != null && (
        <img
          src={global.img_link + upload_image}
          className="author"
          alt="author"
        />
      )} */}
            {author_name}
        </Link>
    </li>
}

export function NAuthors({ authors_data, author }) {
    if (authors_data) return (
        authors_data.map(a => <Author {...a} key={a.id} />)
    )
    else return <Author {...author} />
}