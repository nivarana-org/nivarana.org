import moment from 'moment';
import { NAuthors } from '../authors/Authors';
import { NAuthorsBio } from '../authors/Bios';
import ViewCount from './ViewCount';

function Article({ data }) {
  return (
  <>
      <div className="post post-single">
        <div className="post-header">
          <h1 className="text-3xl font-bold mt-0 mb-3 p-2">{data.page_title}</h1>
          <div className="mb-3">
            <p className="text-lg text-gray-600 p-2">{data.meta_description}</p>
          </div>
          <div className="flex items-center space-x-4 p-2">
            <ul className="flex space-x-2 text-sm text-gray-500 list-none items-center">
              <NAuthors authors_data={data.authors_data} author={data.author} />
              <li>{moment(data.created_at).format('MMMM DD, YYYY')}</li>
              <ViewCount id={data.id} count={data.total_views} />
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <img
            src={data.upload_image}
            alt={data.image_text}
            className="w-full h-auto"
          />
        </div>
        <div className="post-content mt-4 p-2">
          <p className="font-sans">{data.first_peragraph}</p>
        </div>
        <div
          className="post-content mt-4 font-sans text-lg p-2"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>
      </div>
      <NAuthorsBio authors_data={data.authors_data} author={data.author} />
      </>
  );
}

export default Article;
