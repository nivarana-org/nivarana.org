'use client';
import { addNewsLetterSubscriber } from '@/network/api';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

function NewsletterBox() {
    const [subscriptionEmail, setSubscriptionEmail] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (subscriptionEmail === '') {
            toast.error('Please enter email address');
            return;
        } else if (!emailValidation.test(subscriptionEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }
        setButtonLoading(true);
            addNewsLetterSubscriber(subscriptionEmail)
            .then((json) => {
                if (!json.status) {
                    setButtonLoading(false);
                    toast.error(json.message);
                } else {
                    setButtonLoading(false);
                    toast.success(json.msg);
                    setSubscriptionEmail('');
                }
                return json;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setButtonLoading(false);
            });
    };
    return (
        <div className="widget rounded">
            <div className="widget-header text-center">
                <h3 className="widget-title">Newsletter</h3>
                <img src="/images/wave.svg" className="wave" alt="wave" />
            </div>
            <div className="widget-content">
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <input
                            className="form-control w-100 text-center"
                            placeholder="Email address…"
                            type="email"
                            value={subscriptionEmail}
                            onChange={(e) => setSubscriptionEmail(e.target.value)}
                        />
                    </div>
                    {buttonLoading ? (
                        <button className="btn btn-default btn-full disabled">
                            Signing Up...
                        </button>
                    ) : (
                        <button className="btn btn-default btn-full" type="submit">
                            Sign Up
                        </button>
                    )}
                </form>
                <span className="newsletter-privacy text-center mt-3">
                    By signing up, you agree to our Terms.
                </span>
                <Toaster position="bottom-right" />
            </div>
        </div>
    )
}

export default NewsletterBox;