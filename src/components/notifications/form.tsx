"use client"
import { sendWebPushNotificationAction } from "@/actions/notifications";
import { Button, FormControl, FormHelperText, FormLabel, Input, Stack, TextField } from "@mui/joy";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" color="primary" aria-disabled={pending}>
            Notify all web push subscribers
        </Button>
    );
}


const initialState = {
    message: ""
}

export function NotifyForm() {
    const [state, formAction] = useActionState(sendWebPushNotificationAction, initialState);
    return (
        <form action={formAction}>
            <Stack spacing={2}>
                <FormControl required>
                    <FormLabel>Title</FormLabel>
                    <Input name="title"></Input>
                    <FormHelperText>
                        This will be shown as the title of the notification
                    </FormHelperText>
                </FormControl>
                <FormControl required>
                    <FormLabel>Body</FormLabel>
                    <Input name="body"></Input>
                    <FormHelperText>
                        This will be shown as the content. Might get clipped.
                    </FormHelperText>
                </FormControl>
                <FormControl required>
                    <FormLabel>URL</FormLabel>
                    <Input name="url" type="url"></Input>
                    <FormHelperText>
                        When notification is clicked, send user to this URL
                    </FormHelperText>
                </FormControl>
                <SubmitButton />
            </Stack>

            <p aria-live="polite" className="sr-only" role="status">
                {state?.message}
            </p>
            {state?.error ? <p>{JSON.stringify(state?.error)}</p> : null}
            {state?.message ? <p>{state?.message}</p> : null}
        </form>
    );
}