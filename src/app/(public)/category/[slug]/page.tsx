import ArticlePreview from '@/components/article/ArticlePreview';
import Sidebar from '@/components/sidebar';
import { getCategoryPosts } from '@/network/api';
import { Metadata, ResolvingMetadata } from 'next';

async function Page(props: Props) {
  const params = await props.params;
  const slug = params.slug;
  const data = await getCategoryPosts(slug);
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          <div className='text-center text-black mb-8'>
            <div className="font-bold text-4xl mx-auto">{data.category_name.name}</div>
          </div>
          {data.data.map((item) => (
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
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug
  const data = await getCategoryPosts(slug);
  return {
    title: data.category_name.name,
    description: data.category_name.meta_description ?? (await parent).description,
    keywords: data.category_name.meta_keyword ?? (await parent).keywords
  }
}


export default Page;