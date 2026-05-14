import paypal from "@paypal/checkout-server-sdk";
import client from "../config/paypalClient.js";

/* =========================
   CREATE ORDER
========================= */
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "PHP",
            value: amount,
          },
        },
      ],
    });

    const order = await client.execute(request);

    res.json({ id: order.result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   CAPTURE ORDER
========================= */
export const captureOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client.execute(request);

    res.json(capture.result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
