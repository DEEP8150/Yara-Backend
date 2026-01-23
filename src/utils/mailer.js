import nodemailer from 'nodemailer'
import axios from 'axios'

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// })




export const sendWelcomeEmailToCustomer = async (to, organization, password) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Yara",
          email: process.env.EMAIL_USER,
        },
        to: [{ email: to }],
        subject: "Welcome to Yara!",
        htmlContent: `
          <h2>Welcome, ${organization}</h2>
          <p>You have been successfully onboarded to <b>Yara</b>.</p>
          <p><b>Password:</b> ${password}</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Brevo API Error:", error.response?.data || error.message);
  }
};

export const sendWelcomeEmailToEngineer = async (to, firstName, lastName, password) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Yara",
          email: process.env.EMAIL_USER,
        },
        to: [{ email: to }],
        subject: "Welcome to Yara!",
        textContent: `Welcome ${firstName} ${lastName}. Your password is ${password}`,
        htmlContent: `
        <h2>Welcome, ${firstName} ${lastName}</h2>
        <p>You have been successfully onboarded to <b>Yara</b>.</p>
        <p>We are glad to have you with us.</p>
        <p><b>Password for Yara Application:</b> ${password}</p>
      `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Brevo API Error:", error.response?.data || error.message);
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
      issue,
      organization,
      status,
      comment,
      synergyNumber,
    } = data;

    const htmlContent = `
      <h2>Ticket Update Notification</h2>

      <h3>Ticket Details</h3>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Organization:</strong> ${organization}</p>
      <p><strong>Project Number:</strong> ${projectNumber}</p>
      <p><strong>Module Name:</strong> ${productName}</p>
      <p><strong>Issue Type:</strong> ${issueType}</p>
      <p><strong>Issue Type:</strong> ${issue}</p>
      <p><strong>Issue Details:</strong> ${issueDetails}</p>
      <p><strong>Status:</strong> ${status}</p>

      <h3>Admin Action</h3>
      <p><strong>Comment:</strong> ${comment || "N/A"}</p>
      <p><strong>Synergy Number:</strong> ${synergyNumber || "N/A"}</p>
    `;

    const textContent = `
      Ticket Update Notification

      Ticket ID: ${ticketId}
      Organization: ${organization}
      Project Number: ${projectNumber}
      Module Name: ${productName}
      Issue Type: ${issueType}
      Issue: ${issue}
      Issue Details: ${issueDetails}
      Status: ${status}

      Comment: ${comment || "N/A"}
      Synergy Number: ${synergyNumber || "N/A"}
          `;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Yara",
          email: process.env.EMAIL_USER,
        },
        to: [{ email }],
        subject: `Ticket Update - Project #${projectNumber}`,
        htmlContent,
        textContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Ticket email sent to:", email);
  } catch (error) {
    console.error(
      "Brevo Ticket Email Error:",
      error.response?.data || error.message
    );
  }
};


export const sendOtpEmail = async (email, otp) => {
  try {
    const htmlContent = `
      <h2>Your Password Reset OTP</h2>
      <h3>YARA</h3>
      <p>OTP: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `;

    const textContent = `
      Your Password Reset OTP

      OTP: ${otp}
      This OTP is valid for 10 minutes.
    `;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Yara",
          email: process.env.EMAIL_USER,
        },
        to: [{ email }],
        subject: "Your OTP for Password Reset",
        htmlContent,
        textContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OTP email sent to:", email);
  } catch (error) {
    console.error(
      "Brevo OTP Email Error:",
      error.response?.data || error.message
    );
  }
};


export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    const htmlContent = `
      <h2>Password Reset Successful</h2>
      <p>Your password has been changed successfully.</p>
      <p>If you did not perform this action, contact support immediately.</p>
    `;

    const textContent = `
      Password Reset Successful

      Your password has been changed successfully.
      If you did not perform this action, contact support immediately.
    `;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Yara",
          email: process.env.EMAIL_USER,
        },
        to: [{ email }],
        subject: "Password Reset Successful",
        htmlContent,
        textContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Password reset success email sent to:", email);
  } catch (error) {
    console.error(
      "Brevo Reset Success Email Error:",
      error.response?.data || error.message
    );
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

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Yara",
          email: process.env.EMAIL_USER,
        },
        to: [{ email }],
        subject: "Reset Your Password",
        htmlContent: message,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending reset password email:", error.response?.data || error.message);
  }
};


export const sendTicketRaisedEmail = async (to, ticket, customer) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Yara Support",
          email: process.env.EMAIL_USER,
        },
        to: [{ email: to }],
        subject: `New Ticket Raised - ${ticket.projectNumber}`,
        htmlContent: `
          <h2>New Ticket Raised</h2>

          <h3>Ticket Details</h3>
          <p><b>Product:</b> ${ticket.productName}</p>
          <p><b>Project Number:</b> ${ticket.projectNumber}</p>
          <p><b>Organization:</b> ${ticket.organization}</p>
          <p><b>Issue Type:</b> ${ticket.issueType}</p>
          <p><b>Issue:</b>${ticket.issue}</p>
          <p><b>Issue Details:</b> ${ticket.issueDetails}</p>

          <br/>
          <p>Our team will respond shortly.</p>

          <p>Regards,<br><b>Yara Support Team</b></p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Email Error:", error.response?.data || error.message);
  }
};

export const sendFeedbackEmail = async (email, name, feedbackUrl) => {
  try {
    const message = `
      <h2>We Value Your Feedback</h2>

      <p>Dear ${name || "Customer"},</p>

      <p>
        Thank you for working with us.
        Please take a moment to share your feedback for the project.
      </p>

      <p>
        Click the link below to open the feedback form:
      </p>

      <a
        href="${feedbackUrl}"
        style="
          color: #ffffff;
          background-color: #007b5e;
          padding: 10px 18px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          display: inline-block;
          margin-top: 10px;
        "
      >
        Open Feedback Form
      </a>

      <p>
        Best regards,<br />
        <strong>YARA Team</strong>
      </p>
    `;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "YARA Team",
          email: process.env.EMAIL_USER,
        },
        to: [{ email }],
        subject: "Feedback Request",
        htmlContent: message,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending feedback email:", error.response?.data || error.message);
    throw error;
  }
};

