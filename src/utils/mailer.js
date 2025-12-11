import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendWelcomeEmailToCustomer = async (to, organization, password) => {
  try {
    const mailOptions = {
      from: `"Yara" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to Yara!",
      html: `
        <h2>Welcome, ${organization}</h2>
        <p>You have been successfully onboarded to <b>Yara</b>.</p>
        <p>We are glad to have you with us.</p>
        <p><b>Password:</b> ${password}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Welcome email sent to:", to);
  } catch (error) {
    console.error("Email Error:", error);
  }
};

export const sendWelcomeEmailToEngineer = async (to, firstName, lastName, password) => {
  try {
    const mailOptions = {
      from: `"Yara" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to Yara!",
      html: `
        <h2>Welcome, ${firstName} ${lastName}</h2>
        <p>You have been successfully onboarded to <b>Yara</b>.</p>
        <p>We are glad to have you with us.</p>
        <p><b>Password:</b> ${password}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Welcome email sent to:", to);
  } catch (error) {
    console.error("Email Error:", error);
  }
};


export const sendTicketEmailsToParties = async (email, data) => {
  try {
    const {
      ticketId,
      projectNumber,
      productName,
      issueDetails,
      issueType,
      organization,
      customerEmail,
      status,
      comment,
      synergyNumber,
    } = data;

    const htmlMessage = `
        <h2>Ticket Update Notification</h2>

        <h3>Ticket Details</h3>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Organization:</strong> ${organization}</p>
        <p><strong>Project Number:</strong> ${projectNumber}</p>
        <p><strong>Product Name:</strong> ${productName}</p>
        <p><strong>Issue Type:</strong> ${issueType}</p>
        <p><strong>Issue Details:</strong> ${issueDetails}</p>
        <p><strong>Status:</strong> ${status}</p>
        
        <h3>Admin Action</h3>
        <p><strong>Comment:</strong> ${comment}</p>
        <p><strong>Synergy Number:</strong> ${synergyNumber}</p>`;

    // <p><strong>Customer Email:</strong> ${customerEmail}</p>

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: `Ticket Update - Project #${projectNumber}`,
      html: htmlMessage,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendOtpEmail = async (email, otp) => {
  try {
    const html = `
      <h2>Your Password Reset OTP</h2>
      <h3>YARA.</h3>
      <p>OTP: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Your OTP for Password Reset",
      html
    });

  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};


export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    const html = `
      <h2>Password Reset Successful</h2>
      <p>Your password has been changed successfully.</p>
      <p>If you did not perform this action, contact support immediately.</p>
    `;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Password Reset Successful",
      html
    });

  } catch (error) {
    console.error("Error sending reset success email:", error);
  }
};

export const sendResetPasswordEmail = async (email, resetUrl) => {
  try {
    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to set a new password:</p>
      <a href="${resetUrl}" style="color:blue;font-weight:bold;">Reset Password</a>
      <p>This link expires in 10 minutes.</p>
    `;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Reset Your Password",
      html: message,
    });

    console.log("Reset password email sent");
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};


export const sendTicketRaisedEmail = async (to, ticket, customer) => {
  try {
    const mailOptions = {
      from: `"Yara Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: `New Ticket Raised - ${ticket.projectNumber}`,
      html: `
        <h2>New Ticket Raised</h2>

        <h3>Ticket Details</h3>
        <p><b>Product:</b> ${ticket.productName}</p>
        <p><b>Project Number:</b> ${ticket.projectNumber}</p>
        <p><b>Organization:</b> ${ticket.organization}</p>
        <p><b>Issue Type:</b> ${ticket.issueType}</p>
        <p><b>Issue Details:</b> ${ticket.issueDetails}</p>

        <br/>
        <p>Our team will respond shortly.</p>

        <p>Regards,<br><b>Yara Support Team</b></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Ticket raised email sent to:", to);
  } catch (error) {
    console.error("Email Error:", error);
  }
};
