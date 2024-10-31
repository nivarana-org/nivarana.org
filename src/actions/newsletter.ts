import { addNewsLetterSubscriber } from "@/data/cms";

export const addNewsLetterSubscriberAction = async (prevState: { message: string }, formData: FormData) => {
    const email = formData.get('email') || "";
    if (typeof email !== 'string') return {message: "Not an email address"};
    try {
        await addNewsLetterSubscriber(email);
        return { message: "Added successfully" };
    }
    catch (e) {
        if (e.code = "ER_DUP_ENTRY") return { error: "Email already subscribed" };
        return { error: "Couldn't add the email" };
    }
}