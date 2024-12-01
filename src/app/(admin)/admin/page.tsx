import { getArticlesCount, getSubscribersCount, getWebPushSubscriberCount } from "@/data/cms"
import Link from "next/link"

function DashboardItem({ name, count, link }: { name: string, count?: number, link: string }) {
  return <Link href={link}>
    <div className="p-4 bg-cyan-100 hover:bg-cyan-400 text-center">
      <div>
        {count ? <div>{count}</div> : null}
      </div>
      <div>
        {name}
      </div>
    </div>
  </Link>

}

export default async function Page() {
  const [
    newsletterSubscriberCount,
    articleCount,
    webNotificationSubscriberCount
  ] = await Promise.all([
    getSubscribersCount(),
    getArticlesCount(),
    getWebPushSubscriberCount(),
  ])
  
  return (
    <div className="p2 flex gap-2">
      <DashboardItem name="Newsletter Subscribers" link="/admin/newsletter" count={newsletterSubscriberCount}></DashboardItem>
      <DashboardItem name="Web Notifications Subscribers" link="/admin/push-notifications" count={webNotificationSubscriberCount}></DashboardItem>
      <DashboardItem name="Articles" link="/admin/articles" count={articleCount}></DashboardItem>
    </div>
  )
}