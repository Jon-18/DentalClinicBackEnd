import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("SMTP ERROR:", error);
//   } else {
//     console.log("SMTP READY");
//   }
// });

const sender = {
  email: process.env.EMAIL_USER, // must be verified in Brevo
  name: "Clinic Sibonga Dental",
};

export const sendApprovalEmailAdmin = async (appt) => {
  try {
    await apiInstance.sendTransacEmail({
      sender,
      to: [{ email: appt.email }],
      subject: "Your Appointment Is Confirm By Admin",
      htmlContent: `
        <h2>Appointment Confirmed 🎉</h2>

        <p>Hello <b>${appt.fullName}</b>,</p>
        <p>Your dental appointment has been approved by the admin. Please wait for the doctor's approval.</p>

        <p>
          <b>Date:</b> ${appt.appointmentDate}<br>
          <b>Time:</b> ${appt.startTime} - ${appt.endTime}<br>
          <b>Dentist:</b> ${appt.doctorName}
        </p>

        <p>Thank you and see you soon! 🦷</p>
      `,
    });

    console.log("📨 Admin approval email sent to:", appt.email);
  } catch (error) {
    console.error("Email error:", error.response?.body || error.message);
  }
};

// ✅ FINAL APPROVAL
export const sendApprovalEmail = async (appt) => {
  try {
    await apiInstance.sendTransacEmail({
      sender,
      to: [{ email: appt.email }],
      subject: "Your Appointment Is Confirmed",
      htmlContent: `
        <h2>Appointment Confirmed 🎉</h2>

        <p>Hello <b>${appt.fullName}</b>,</p>
        <p>Your dental appointment has been approved by the doctor.</p>

        <p>
          <b>Date:</b> ${appt.appointmentDate}<br>
          <b>Time:</b> ${appt.startTime} - ${appt.endTime}<br>
          <b>Dentist:</b> ${appt.doctorName}
        </p>

        <p>Thank you and see you soon! 🦷</p>
      `,
    });

    console.log("📨 Approval email sent to:", appt.email);
  } catch (error) {
    console.error("Email error:", error.response?.body || error.message);
  }
};

// ❌ DENIAL
export const sendDenialEmail = async (appt, reason) => {
  try {
    await apiInstance.sendTransacEmail({
      sender,
      to: [{ email: appt.email }],
      subject: "Appointment Request Update",
      htmlContent: `
        <h2>Appointment Request Update</h2>

        <p>Hello <b>${appt.fullName}</b>,</p>

        <p>We regret to inform you that your appointment request has been denied.</p>

        <p>
          <b>Date:</b> ${appt.appointmentDate}<br>
          <b>Time:</b> ${appt.startTime} - ${appt.endTime}<br>
          <b>Dentist:</b> ${appt.doctorName}
        </p>

        <p><b>Reason:</b> ${reason}</p>

        <p>You may book another schedule at your convenience.</p>

        <p>Thank you! 🦷</p>
      `,
    });

    console.log("📨 Denial email sent to:", appt.email);
  } catch (error) {
    console.error("Email error:", error.response?.body || error.message);
  }
};
