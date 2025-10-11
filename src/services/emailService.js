import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });
};

export const createOrderEmailTemplate = (orderData) => {
  const {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    items,
    totalAmount,
    shippingAddress,
    orderNotes,
    orderDate = new Date().toLocaleDateString(),
  } = orderData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Order - Coco Culotte</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .content { background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; }
            .order-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; font-size: 18px; color: #2c3e50; }
            .footer { text-align: center; margin-top: 20px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛍️ New Order Received</h1>
                <p>Coco Culotte - Order Management System</p>
            </div>
            
            <div class="content">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${orderId}</p>
                
                <div class="order-details">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${customerName}</p>
                    <p><strong>Email:</strong> ${customerEmail}</p>
                    <p><strong>Phone:</strong> ${customerPhone}</p>
                    <p><strong>Order Date:</strong> ${orderDate}</p>
                </div>

                <div class="order-details">
                    <h3>Shipping Address</h3>
                    <p>${shippingAddress}</p>
                </div>

                <div class="order-details">
                    <h3>Order Items</h3>
                    ${items
                      .map(
                        (item) => `
                        <div class="item">
                            <span>${item.name} (Qty: ${item.quantity})</span>
                            <span>$${item.unitPrice} × ${item.quantity} = $${item.totalPrice}</span>
                        </div>
                    `
                      )
                      .join("")}
                    <div class="item total">
                        <span>Total Amount:</span>
                        <span>$${totalAmount}</span>
                    </div>
                </div>

                ${
                  orderNotes
                    ? `
                <div class="order-details">
                    <h3>Order Notes</h3>
                    <p>${orderNotes}</p>
                </div>
                `
                    : ""
                }
            </div>
            
            <div class="footer">
                <p>This order was received through your website contact form.</p>
                <p>Please process this order as soon as possible.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const createContactEmailTemplate = (contactData) => {
  const {
    fullName,
    email,
    phone,
    message,
    contactDate = new Date().toLocaleDateString(),
  } = contactData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission - Coco Culotte</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .content { background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; }
            .contact-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .message-box { background-color: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3; }
            .footer { text-align: center; margin-top: 20px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 New Contact Form Submission</h1>
                <p>Coco Culotte - Contact Management</p>
            </div>
            
            <div class="content">
                <div class="contact-details">
                    <h3>Contact Information</h3>
                    <p><strong>Name:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Date:</strong> ${contactDate}</p>
                </div>

                <div class="message-box">
                    <h3>Message</h3>
                    <p>${message}</p>
                </div>
            </div>
            
            <div class="footer">
                <p>This message was received through your website contact form.</p>
                <p>Please respond to the customer as soon as possible.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

export const sendOrderEmail = async (orderData, recipientEmail) => {
  const subject = `New Order from ${orderData.customerName} - Coco Culotte`;
  const htmlContent = createOrderEmailTemplate(orderData);

  return await sendEmail(recipientEmail, subject, htmlContent);
};

export const sendContactEmail = async (contactData, recipientEmail) => {
  const subject = `New Contact Form Submission from ${contactData.fullName} - Coco Culotte`;
  const htmlContent = createContactEmailTemplate(contactData);

  return await sendEmail(recipientEmail, subject, htmlContent);
};
