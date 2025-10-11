# Email Service Setup Guide

This guide will help you set up the email service for your Coco Culotte backend to receive order and contact form emails.

## 🚀 Quick Setup

### How It Works

This email service is designed for **self-notification**. When orders or contact forms are submitted through your frontend, the system automatically sends emails to the address configured in your `EMAIL_USER` environment variable. This allows you to receive notifications about:

- New orders with complete details and calculated totals
- Contact form submissions from potential customers

No need to specify recipient emails in your API calls - everything is sent to your configured email address.

### 1. Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Server Configuration
PORT=3000

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 2. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `EMAIL_PASS` in your `.env` file

### 3. Alternative Email Services

You can use other email services by modifying the transporter configuration in `src/services/emailService.js`:

```javascript
// For Outlook/Hotmail
const transporter = nodemailer.createTransporter({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// For custom SMTP
const transporter = nodemailer.createTransporter({
  host: "smtp.your-provider.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## 📧 API Endpoints

### 1. Order Email Endpoint

**POST** `/api/email/order`

Send order details via email.

**Request Body:**

```json
{
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com",
  "customerPhone": "+1234567890",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "shippingAddress": "123 Main St, City, State 12345",
  "orderNotes": "Please handle with care"
}
```

**Note:**

- `productId` must be a valid product ID from your database
- `quantity` must be a positive integer
- Prices and total amount are calculated automatically by the backend
- A unique `orderId` is generated automatically
- Emails are sent to the address configured in `EMAIL_USER` environment variable

**Response:**

```json
{
  "success": true,
  "message": "Order email sent successfully",
  "orderId": "ORD-1760185719760-DTWC3R0AW",
  "totalAmount": 549.97,
  "messageId": "email-message-id"
}
```

### 2. Contact Form Endpoint

**POST** `/api/email/contact`

Send contact form submission via email.

**Request Body:**

```json
{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "message": "I love your products! When will you have new collections?"
}
```

**Note:**

- Emails are sent to the address configured in `EMAIL_USER` environment variable

**Response:**

```json
{
  "success": true,
  "message": "Contact email sent successfully",
  "messageId": "email-message-id"
}
```

## 🔒 Security Features

- **CORS Protection**: Only allows requests from your frontend URL
- **Input Validation**: All data is validated using Zod schemas
- **Error Handling**: Comprehensive error handling and logging
- **Email Templates**: Professional HTML email templates
- **Backend Price Validation**: Product prices are fetched from database, preventing price manipulation
- **Type Safety**: Quantity must be positive integers, product IDs are validated against database
- **Order Management**: Orders are stored in database with unique IDs and calculated totals
- **Self-Emailing**: All emails are sent to the configured `EMAIL_USER` address for self-notification

## 🧪 Testing

1. **Start your server:**

   ```bash
   npm run dev
   ```

2. **Test the endpoints:**

   ```bash
   # Test order endpoint
   curl -X POST http://localhost:3000/api/email/order \
     -H "Content-Type: application/json" \
     -d '{"customerName":"Test User","customerEmail":"test@example.com","customerPhone":"+1234567890","items":[{"productId":1,"quantity":2}],"shippingAddress":"123 Test St, Test City, TC 12345","orderNotes":"Test order"}'

   # Test contact endpoint
   curl -X POST http://localhost:3000/api/email/contact \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Jane Smith","email":"jane@example.com","phone":"+1987654321","message":"Test contact message"}'
   ```

3. **Frontend Integration:**
   ```javascript
   // Example frontend call
   const sendOrder = async (orderData) => {
     const response = await fetch("http://localhost:3000/api/email/order", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         customerName: "John Doe",
         customerEmail: "john@example.com",
         customerPhone: "+1234567890",
         items: [
           { productId: 1, quantity: 2 }, // Product ID from your database
           { productId: 2, quantity: 1 },
         ],
         shippingAddress: "123 Main St, City, State",
         orderNotes: "Optional notes",
         // No recipientEmail needed - emails sent to EMAIL_USER
       }),
     });
     return await response.json();
   };
   ```

## 📁 File Structure

```
src/
├── services/
│   ├── emailService.js      # Email service and templates
│   └── orderService.js      # Order management service
├── controllers/
│   └── email.js             # Email controllers
├── routes/
│   └── email.js             # Email routes
├── schemas/
│   └── email.js             # Validation schemas
├── utils/
│   └── migrateOrders.js     # Database migration for orders
└── middlewares/
    └── validate.js          # Validation middleware
```

## 🎨 Email Templates

The email service includes beautiful HTML templates for:

- **Order emails**: Professional order summary with customer details, items, and totals
- **Contact emails**: Clean contact form submissions with customer information

Templates are responsive and include:

- Professional styling
- Clear information hierarchy
- Company branding
- Mobile-friendly design

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid login" error:**

   - Check your email credentials
   - Ensure you're using an App Password for Gmail
   - Verify 2FA is enabled

2. **"Connection timeout" error:**

   - Check your internet connection
   - Verify SMTP settings for your email provider

3. **CORS errors:**

   - Ensure your frontend URL matches `FRONTEND_URL` in `.env`
   - Check that your frontend is making requests to the correct backend URL

4. **Validation errors:**
   - Check that all required fields are provided
   - Ensure data types match the schema requirements

### Debug Mode:

Enable detailed logging by adding this to your `.env`:

```env
NODE_ENV=development
```

## 📞 Support

If you encounter any issues:

1. Check the console logs for detailed error messages
2. Verify your `.env` configuration
3. Test with the provided test script
4. Ensure all dependencies are installed (`npm install`)

---

**Note**: Make sure to keep your email credentials secure and never commit them to version control!
