import { sendOrderEmail, sendContactEmail } from "../services/emailService.js";
import { createOrder, getOrderById } from "../services/orderService.js";

export const sendOrder = async (req, res) => {
  try {
    const orderData = req.body;

    const orderResult = await createOrder(orderData);

    const emailOrderData = {
      orderId: orderResult.orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderResult.items,
      totalAmount: orderResult.totalAmount,
      shippingAddress: orderData.shippingAddress,
      orderNotes: orderData.orderNotes,
    };

    const result = await sendOrderEmail(emailOrderData, process.env.EMAIL_USER);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Order email sent successfully",
        orderId: orderResult.orderId,
        totalAmount: orderResult.totalAmount,
        messageId: result.messageId,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send order email",
        error: result.error,
      });
    }
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
