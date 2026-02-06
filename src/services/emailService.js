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
    items = [],
    totalAmount,
    shippingAddress,
    orderNotes,
    orderDate = new Date().toLocaleDateString(),
  } = orderData;

  const renderItems = items
    .map(
      (item) => {
        // Use first image from image_urls array, or fallback to image_url for backward compatibility
        const imageUrl = (item.image_urls && item.image_urls.length > 0) 
          ? item.image_urls[0] 
          : (item.image_url || '');
        return `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px; text-align:center;">
            <img src="${imageUrl}" alt="Product Image" width="80" height="80" style="border-radius:5px; display:block; margin:auto;" />
          </td>
          <td style="padding:10px; vertical-align:top;">
            <strong style="font-size:14px; color:#333;">${item.productName}</strong><br/>
            <span style="font-size:13px; color:#777;">ID: ${item.productId}</span><br/>
            <span style="font-size:13px;">Quantity: <strong>${item.quantity}</strong></span>
          </td>
          <td style="padding:10px; text-align:right; vertical-align:top;">
            <span style="font-size:13px;">$${item.unitPrice} × ${item.quantity}</span><br/>
            <strong style="font-size:14px; color:#2c3e50;">$${item.totalPrice}</strong>
          </td>
        </tr>
      `;
      }
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order - Coco Culotte</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin:0; padding:0; background-color:#f8f9fa; }
        .container { max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
        .header { background-color: #f1f3f5; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .order-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; margin: 20px; color: #666; font-size: 12px; }
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
          <p><strong>Order Date:</strong> ${orderDate}</p>
          
          <div class="order-details">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${customerPhone}</p>
            <a href="https://api.whatsapp.com/send?phone=${customerPhone.replace(
              /[^0-9]/g,
              ""
            )}"
           target="_blank"
           style="margin-left:8px; text-decoration:none;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
               alt="WhatsApp"
               width="18"
               height="18"
               style="vertical-align:middle; border:none;" />
        </a>
          </div>

          <div class="order-details">
            <h3>Shipping Address</h3>
            <p>${shippingAddress}</p>
          </div>

          <div class="order-details">
            <h3>Order Items</h3>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <thead>
                <tr style="background-color:#e9ecef; text-align:left;">
                  <th style="padding:8px;">Image</th>
                  <th style="padding:8px;">Product</th>
                  <th style="padding:8px; text-align:right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${renderItems}
                <tr>
                  <td colspan="2" style="padding:10px; text-align:right; font-weight:bold; font-size:16px;">Total:</td>
                  <td style="padding:10px; text-align:right; font-weight:bold; font-size:16px; color:#2c3e50;">$${totalAmount}</td>
                </tr>
              </tbody>
            </table>
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
          &copy; ${new Date().getFullYear()} Coco Culotte. All rights reserved.
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
