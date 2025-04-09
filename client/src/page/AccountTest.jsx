import React, { useState } from "react";
import axios from "axios";
import { Button, InputNumber, message } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RB5Lm2esuIrmp0zTxjv03FmfWgHHJuGX3I4SpPvnAworTWEVP81CF4fsKsGsfUv49tTFmrH0tiNEc0SeIf2vVCv00shc6lTZ8");

const CheckoutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !amount || amount < 1000) {
            message.error("Vui lòng nhập số tiền hợp lệ (tối thiểu 1000 VNĐ)");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // Giả sử token lưu ở localStorage
            const { data } = await axios.post(
                "http://localhost:5000/api/payment/deposit",
                { amount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.status !== "OK") {
                throw new Error(data.message || "Lỗi từ server");
            }

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                message.error(result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                message.success("Nạp tiền thành công!");
            }
        } catch (error) {
            message.error(error.message || "Nạp tiền thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
            <Button type="primary" htmlType="submit" loading={loading} disabled={!stripe || loading}>
                Nạp tiền
            </Button>
        </form>
    );
};

const Deposit = () => {
    const [amount, setAmount] = useState(null); // Khởi tạo null để tránh giá trị mặc định 0

    return (
        <div style={{ padding: 20 }}>
            <h2>Nạp tiền</h2>
            <InputNumber
                min={1000}
                value={amount}
                onChange={(value) => setAmount(value)}
                style={{ marginBottom: 20 }}
                formatter={(value) => `${value || ""} VNĐ`}
                parser={(value) => value.replace(" VNĐ", "")}
            />
            <Elements stripe={stripePromise}>
                <CheckoutForm amount={amount} />
            </Elements>
        </div>
    );
};

export default Deposit;