import { sendContactEmail } from "../services/emailService.js";
import { createOrder } from "../services/orderService.js";

export const sendOrder = async (req, res) => {
  try {
    const orderData = req.body;

    const orderResult = await createOrder(orderData);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: orderResult.orderId,
      totalAmount: orderResult.totalAmount,
    });
  } catch (error) {
    console.error("Error in sendOrder controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const sendContact = async (req, res) => {
  try {
    const contactData = req.body;

    const result = await sendContactEmail(contactData, process.env.EMAIL_USER);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Contact email sent successfully",
        messageId: result.messageId,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send contact email",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in sendContact controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
