import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendApprovalEmailAdmin = async (appt) => {
  await transporter.sendMail({
    from: "clinicsibongadental@gmail.com",
    to: appt.email,
    subject: "Your Appointment Is Confirm By Admin",
    html: `
      <h2>Appointment Confirmed 🎉</h2>

      <p>Hello <b>${appt.fullName}</b>,</p>
      <p>Your dental appointment has been approved by the admin. Please wait the doctor's approval</p>

      <p>
        <b>Date:</b> ${appt.appointmentDate}<br>
        <b>Time:</b> ${appt.startTime} - ${appt.endTime}<br>
        <b>Dentist:</b> ${appt.doctorName}
      </p>

      <p>Thank you and see you soon! 🦷</p>
    `,
  });

  console.log("📨 Approval email sent to:", appt.email);
};

// ✅ APPROVAL
export const sendApprovalEmail = async (appt) => {
  await transporter.sendMail({
    from: "clinicsibongadental@gmail.com",
    to: appt.email,
    subject: "Your Appointment Is Confirmed",
    html: `
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
};

export const sendDenialEmail = async (appt, reason) => {
  await transporter.sendMail({
    from: "clinicsibongadental@gmail.com",
    to: appt.email,
    subject: "Appointment Request Update",
    html: `
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
};
