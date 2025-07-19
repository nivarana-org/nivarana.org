"use client";
import { addNewsLetterSubscriberAction } from "@/actions/newsletter";
import { useActionState, useEffect } from "react";
import { toast, Toaster } from "sonner";

function SubmitButton({ isPending }: { isPending: boolean }) {
    return (
        <button
            type="submit"
            aria-disabled={isPending}
            className="bg-nivarana-white px-4 py-1 rounded cursor-pointer"
        >
            {isPending ? "Signing up..." : "Sign Up"}
        </button>
    );
}

function NewsletterBox() {
    const [state, formAction, isPending] = useActionState(
        addNewsLetterSubscriberAction,
        {},
    );

    useEffect(() => {
        if (state.error) toast.error(state.error);
        if (state.message) toast.success(state.message);
    }, [state]);

    return (
        <div className="">
            <h3 className="text-lg">Newsletter</h3>
            <form action={formAction}>
                <label htmlFor="email" className="sr-only">
                    Enter Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="form-control"
                    placeholder="Email address..."
                />
                <span className="mt-3">
                    By signing up, you agree to our Terms.
                </span>

                <SubmitButton isPending={isPending} />
                <Toaster position="bottom-right"></Toaster>
                <p aria-live="polite" className="sr-only" role="status">
                    {state?.message}
                </p>
            </form>
        </div>
    );
}

export default NewsletterBox;
