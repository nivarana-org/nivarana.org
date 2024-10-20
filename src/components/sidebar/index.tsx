import NewsletterBox from '../newsletter';
import PopularPosts from './popular';
import RecentPosts from './recent';

function Sidebar() {
  
  return (
    <div className="sidebar">
      <PopularPosts></PopularPosts>
      <NewsletterBox></NewsletterBox>
      <RecentPosts></RecentPosts>
    </div>
  );
}

export default Sidebar;
