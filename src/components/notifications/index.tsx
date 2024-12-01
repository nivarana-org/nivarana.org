"use client"
import { sendTestNotification as sendTestNotificationActual, subscribeUser, unsubscribeUser } from "@/actions/notifications";
import Image from "next/image";
import { useEffect, useState } from "react"

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  console.log(base64);

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    await subscribeUser(JSON.stringify(sub))
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    await unsubscribeUser(JSON.stringify(subscription))
    setSubscription(null)
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendTestNotificationActual(JSON.stringify(subscription))
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }

  return (
    <div className="widget rounded">
      <div className="widget-header text-center">
        <h3 className="widget-title">Push Notifications</h3>
        <Image src="/images/wave.svg" className="wave" alt="wave" width={50} height={20} />
      </div>
      <div className="widget-content">
        {subscription ? (
          <>
            <p>You are subscribed to push notifications.</p>
            <div className="flex flex-row">
              <button onClick={unsubscribeFromPush} className='btn btn-default'>Unsubscribe</button>
              <button onClick={sendTestNotification} className='btn btn-default'>Test Notification</button>
            </div>
          </>
        ) : (
          <>
            <p>You are not subscribed to push notifications.</p>
            <button onClick={subscribeToPush} className='btn btn-default btn-full'>Subscribe</button>
          </>
        )}
      </div>
    </div>
  )
}