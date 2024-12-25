import { db } from "./cms";

export const saveSubscriber = (subscription: string) => {
    return db("push_subscriptions").insert({ subscription });
};

export const deleteSubscriber = (subscription: string) => {
    return db("push_subscriptions").where({ subscription }).delete();
};

export const getAllSubscribers = () => {
    return db("push_subscriptions").select("subscription");
};
