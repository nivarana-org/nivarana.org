'use client';
import { addNewsLetterSubscriberAction } from '@/actions/newsletter';
import { useActionState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

function SubmitButton({ isPending }: { isPending: boolean }) {
    return (
        <button type="submit" aria-disabled={isPending} className='btn btn-default btn-full'>
            {isPending ? "Signing up..." : "Sign Up"}
        </button>
    );
}

function NewsletterBox() {
    const [state, formAction, isPending] = useActionState(addNewsLetterSubscriberAction, {});

    useEffect(() => {
        if (state.error) toast.error(state.error);
        if (state.message) toast.success(state.message);
    }, [state])

    return (
        <div className="widget rounded">
            <div className="widget-header text-center">
                <h3 className="widget-title">Newsletter</h3>
                <img src="/images/wave.svg" className="wave" alt="wave" />
            </div>
            <div className="widget-content">
                <form action={formAction}>
                    <label htmlFor="email" className='sr-only'>Enter Email</label>
                    <input type="email" id="email" name="email" required className='w-100 text-center form-control' placeholder="Email address..."/>
                    <span className="newsletter-privacy text-center mt-3">
                        By signing up, you agree to our Terms.
                    </span>

                    <SubmitButton isPending={isPending} />
                    <Toaster position='bottom-right'></Toaster>
                    <p aria-live="polite" className="sr-only" role="status">
                        {state?.message}
                    </p>
                </form>
            </div>
        </div>
    )
}

export default NewsletterBox;