import ArticlePreview from '@/components/article/ArticlePreview';
import Sidebar from '@/components/sidebar';
import { getAuthorDetails } from '@/network/api';
import { Metadata, ResolvingMetadata } from 'next';

async function Page({ params }: Props) {
  const slug = params.slug;
  const data = await getAuthorDetails(slug);
  return (
    <div className="max-w-screen-xl mx-auto">
      <AuthorDetails data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          {data.blogs.map((item, index) => (
            <ArticlePreview {...item} key={item.path} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>)
}

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug
  const data = await getAuthorDetails(slug);
  return {
    title: data.author_name,
    description: data.meta_description ?? (await parent).description,
    keywords: data.meta_keyword ?? (await parent).keywords
  }
}

function AuthorPic({ upload_image }) {
  if (upload_image === null) return;
  return <div className="col-md-2 col-sm-2 thumb d-flex justify-content-center align-items-center">
    <img
      src={global.img_link + data.upload_image}
      className="author"
      alt="author"
    />
  </div>
}

async function AuthorDetails({ data }) {
  return (
    <div className='mx-auto max-w-prose rounded border p-4'>
      <AuthorPic upload_image={data.upload_image} />
      <div
        className={
          data.upload_image != null
            ? 'col-md-10 col-sm-10 details'
            : 'col-md-12 col-sm-12 details'
        }
      >
        <h4 className="name mb-0">{data.author_name}</h4>
        {data.first_peragraph != null && (
          <p
            className="mt-2"
            dangerouslySetInnerHTML={{
              __html: data.first_peragraph,
            }}
          />
        )}
        {data.description != null && (
          <p
            className="mt-2"
            dangerouslySetInnerHTML={{
              __html: data.description,
            }}
          />
        )}
      </div>
    </div >
  );
}

export default Page;