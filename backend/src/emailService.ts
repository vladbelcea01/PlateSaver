const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
    port: 587,
    secure: false,
  auth: {
    user: 'platesaverco@gmail.com',
    pass: 'vrpl qpqh uhsj nxlt '
  }
});

export const sendOrderEmail = async (order: any): Promise<void> => {
  const mailOptions = {
    from: 'platesaverco@gmail.com',
    to: order.email,
    subject: `Order #${order._id} Confirmation`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4CAF50;">Thank you for your order, ${order.name}!</h1>
        <p>We are pleased to confirm your order <strong>#${order._id}</strong> placed on <strong>${new Date(order.orderDate).toLocaleString()}</strong>.</p>
        
        <h2>Order Details</h2>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone Number:</strong> ${order.phone_number}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Reserve Status:</strong> ${order.reserved}</p>
        <p><strong>Payment Status:</strong> ${order.payed}</p>
        <p><strong>Payment ID:</strong> ${order.paymentId || 'N/A'}</p>
        
        <h3>Order Items:</h3>
        <ul>
          ${order.products.map((item: any) => `<li>${item.food.dishName} - ${item.quantity} x ${item.food.newPrice}$</li>`).join('')}
        </ul>
        <h3>Total: <strong>${order.totalPayment}$</strong></h3>

        <p>If you have any questions or need further assistance, please do not hesitate to contact us at <a href="mailto:platesaverco@gmail.com">platesaverco@gmail.com</a>.</p>
        <p>Thank you for choosing PlateSaver. We hope you enjoy your meal!</p>
        
        <footer style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc;">
          <p style="font-size: 0.9em;">PlateSaver Co.<br>
          <a href="https://www.platesaver.com" style="color: #4CAF50;">www.platesaver.com</a></p>
        </footer>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};