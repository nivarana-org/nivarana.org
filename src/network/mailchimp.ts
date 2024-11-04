"use server"
import "server-only";

import client from "@mailchimp/mailchimp_marketing";

client.setConfig({
    apiKey: process.env.MAILCHIMP_KEY,
    server: process.env.MAILCHIMP_PREFIX
});

const getList = async () => {
    const response = await client.lists.getAllLists();
    return response
};

export const addMember = async (email: string) => {
    const response = await client.lists.addListMember(process.env.MAILCHIMP_LISTID, {
        email_address: email,
        status: "pending",
    });
}
