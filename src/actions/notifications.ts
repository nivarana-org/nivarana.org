'use server'

import { deleteSubscriber, getAllSubscribers, saveSubscriber } from '@/data/notifications'
import webPush from 'web-push'

webPush.setVapidDetails(
    'mailto:asdofindia@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

export async function subscribeUser(sub: string) {
    return saveSubscriber(sub);
}

export async function unsubscribeUser(sub: string) {
    return deleteSubscriber(sub);
}

export async function notifyAllSubscribers(title: string, body: string, url = 'https://nivarana.org') {
    const subscribers = await getAllSubscribers();

    if (subscribers.length === 0) {
        throw new Error('No subscription available')
    }

    for (const {subscription} of subscribers) {
        await sendNotification(subscription, title, body, url);
    }
    return { success: false, error: 'Failed to send notification' }
}

export async function sendNotification(subscription: string, title: string, body: string, url: string) {
    try {
        await webPush.sendNotification(
            JSON.parse(subscription),
            JSON.stringify({
                title: title,
                body: body,
                icon: '/icon.png',
                url: url
            })
        )
        return { success: true }
    } catch (error) {
        if (error?.statusCode === 410) {
            console.error("Unsubscribing unavailable user");
            unsubscribeUser(subscription);
        } else {
            console.error('Error sending push notification:', error)
        }
        return { success: false, error: 'Failed to send notification' }
    }
    
}

export async function sendTestNotification(subscription: string) {
    return sendNotification(subscription, 'Test Notification', 'You are subscribed to updates from Nivarana via notifications', 'https://nivarana.org')
}


export const sendWebPushNotificationAction = async (prevState: { message?: string }, formData: FormData) => {
    const title = formData.get('title') || "New Post";
    const body = formData.get('body') || "";
    const url = formData.get('url') || "https://nivarana.org";
    try {
        await notifyAllSubscribers(title as string, body as string, url as string);
        return { message: "Notified everyone" };
    }
    catch (e) {
        return { error: e };
    }
}