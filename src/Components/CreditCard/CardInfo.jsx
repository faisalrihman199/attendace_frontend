import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CardInfo = ({ edit, cardData }) => {
    const [stripe, setStripe] = useState(null);
    const [cardElement, setCardElement] = useState(null);
    const [cardholderName, setCardholderName] = useState('');
    const [country, setCountry] = useState('');
    const [last4, setLast4] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [plan, setPlan] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const localUser = JSON.parse(localStorage.getItem('user'));
    const stripe_key = import.meta.env.VITE_APP_STRIPE_KEY;
    const server = import.meta.env.VITE_APP_API_URL;
    const btn = edit ? 'col-md-3 col-sm-12' : 'col-12';

    // Update states whenever `cardData` changes
    useEffect(() => {
        if (cardData) {
            setCardholderName(cardData.cardholder_name || '');
            setCountry(cardData.country || '');
            setLast4(cardData.last4 || '');
            setExpMonth(cardData.exp_month || '');
            setExpYear(cardData.exp_year || '');
        }
    }, [cardData]);

    // Dynamically load Stripe.js and initialize
    useEffect(() => {
        const loadStripe = async () => {
            if (!window.Stripe) {
                const script = document.createElement('script');
                script.src = 'https://js.stripe.com/v3/';
                script.async = true;
                script.onload = () => initializeStripe();
                document.body.appendChild(script);
            } else {
                initializeStripe();
            }
        };

        const initializeStripe = () => {
            const stripeInstance = window.Stripe(stripe_key);
            setStripe(stripeInstance);

            const elements = stripeInstance.elements();
            const card = elements.create('card');
            setCardElement(card);
            card.mount('#card-element');
        };

        loadStripe();
    }, []);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !cardElement) {
            console.error("Stripe is not ready");
            toast.error("Payment system is not initialized. Please refresh the page.");
            setLoading(false);
            return;
        }

        try {
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: cardholderName,
                    address: { country },
                },
            });

            if (error) {
                console.error("Error creating payment method:", error.message);
                toast.error(error.message);
                setLoading(false);
                return;
            }

            let url = server;
            let method = 'POST';

            if (cardData) {
                url += `/user/updateCard?userId=${sessionStorage.getItem('currentBussiness')}`;
                method = 'PUT';
            } else {
                url += '/user/createSubscription';
                if (plan) url += `?price=${plan}`;
                if (localUser.role === 'superAdmin') {
                    if (url.includes('?')) {
                        url += `&userId=${sessionStorage.getItem('currentBussiness')}`;
                    }
                }
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${localUser?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    cardholderName,
                    country,
                }),
            });

            console.log(result);
            const result = await response.json();
            if (response.ok) {
                toast.success('Payment processed successfully');
                navigate(cardData ? '/admin/billing' : '/admin/settings');
            } else {
                toast.error(result.message || 'Payment processing failed');
            }
        } catch (error) {
            console.error("Error occurred:", error.message);
            toast.error("An error occurred during payment processing.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="row mb-3 form-group">
                <div className="col-sm-12 tooltip-container">
                    <label htmlFor="cardholder-name" className="form-label">
                    Cardholder Name
                    </label>
                    <span className="tooltip-text-right">Input the full name as shown on the credit card</span>
                    <input
                        type="text"
                        id="cardholder-name"
                        className="form-control p-2 bg_dede"
                        placeholder="Full name on card"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                    />
                </div>
            </div>

            <div className="row mb-3 form-group">
                <div className="col-sm-12 tooltip-container">
                    <label htmlFor="card-element" className="form-label">
                    Card Information
                    </label>
                    <span className="tooltip-text-right">Input the numerical credit card information. This includes the 16-digit card number, expiration date, and cvc numbers.</span>
                    <div id="card-element" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}></div>
                    <div id="card-errors" role="alert" style={{ color: 'red', marginTop: '10px' }}></div>
                    {cardData && (
                        <div className="mt-2">
                            <input
                                type="text"
                                className="form-control p-2 bg_dede mb-3"
                                readOnly
                                value={`**** **** **** ${last4}`}
                            />
                            <input
                                type="text"
                                className="form-control p-2 bg_dede"
                                readOnly
                                value={`${expMonth} / ${expYear}`}
                            />
                        </div>
                    )}
                </div>
            </div>

            {!cardData && (
                <div className="row mb-3 form-group">
                    <div className="col-sm-12 tooltip-container">
                        <label htmlFor="plan" className="form-label">Select a Plan</label>
                        <span className="tooltip-text-right">Select a monthly subscription plan</span>
                        <select
                        id="plan"
                        className="form-control p-2 bg_dede"
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        >
                            <option value="">Select a Plan</option>
                            <option value="30">{'Starter - Up to 50 Athletes ($30/month)'}</option>
                            <option value="45">{'Premium - Unlimited Athletes ($45/month)'}</option>
                        </select>
                    </div>
                </div>
            )}

            <div className="row mb-3 form-group">
                <div className="col-sm-12 tooltip-container">
                    <label htmlFor="country" className="form-label">Country or Region</label>
                    <span className="tooltip-text-right">Select your country or region</span>
                    <select
                        id="country"
                        className="form-control p-2 bg_dede"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                    </select>
                </div>
            </div>

            <div className="row mb-3 my-2">
                <div className={btn}>
                    {loading ? (
                        <div className="text-center">
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {cardData ? 'Saving...' : 'Subscribing...'}
                        </div>
                    ) : (
                        <button className="btn btns w-100" onClick={handleSubmit}>
                            {cardData ? 'Update' : 'Subscribe'}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default CardInfo;
