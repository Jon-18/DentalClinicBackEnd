// server.js
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import appointmentAdmin from "./routes/appointmentAdmin.js";
import appointmentDoctor from "./routes/appointmentDoctor.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import authRoutes from "./routes/auth.js";
import branchRoutes from "./routes/branchRoutes.js";
import dentistRoutes from "./routes/dentistRoutes.js";
import getAllAppointments from "./routes/getAllAppointmentsRoutes.js";
import getAllAppointmentsPerPatient from "./routes/getAllAppointmentsRoutesPerPatient.js";
import getAllDoctor from "./routes/getAllDoctorRoutes.js";
import getAllPatient from "./routes/getAllPatientRoute.js";
import getAllServices from "./routes/getAllServicesRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import ProfileUser from "./routes/profileUserRouters.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import getUsers from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import patientHistory from "./routes/appointmentHistory.js";
import patientHistoryId from "./routes/appointHistoryByUserId.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "https://dental-clinic-front-end.vercel.app",
    credentials: true,
  }),
);

// ✅ Separate route groups clearly
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/dentists", dentistRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", getUsers);
app.use("/api/profile", ProfileUser);
app.use("/api/getAllDoctor", getAllDoctor);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/appointmentAdmin", appointmentAdmin);
app.use("/api/appointmentDoctor", appointmentDoctor);
app.use("/api/getAllServices", getAllServices);
app.use("/api/getAllAppointmentsRoutes", getAllAppointments);
app.use("/api/getAllPatient", getAllPatient);
app.use("/api/patientHistoryId", patientHistoryId);

app.use(
  "/api/getAllAppointmentsRoutesPerPatient",
  getAllAppointmentsPerPatient,
);
app.use("/api/getAppointmentHistory", patientHistory);

app.use("/api/getDataInDashboard", dashboardRoutes);
app.use("/uploadsReceipt", express.static("uploadsReceipt"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {});
