// dashboardController.js
import db from "../db.js";
export const getDashboard = async (req, res) => {
  const { filter = "Monthly" } = req.query;

  try {
    let appointmentsQuery = "";
    let incomeQuery = "";

    if (filter === "Daily") {
      appointmentsQuery = `
        SELECT DATE(appointmentDate) as label, COUNT(*) as value
        FROM appointments
        GROUP BY DATE(appointmentDate)
        ORDER BY DATE(appointmentDate)
      `;
      incomeQuery = `
        SELECT DATE(appointmentDate) as label, SUM(Price) as value
        FROM appointments
        GROUP BY DATE(appointmentDate)
        ORDER BY DATE(appointmentDate)
      `;
    } else if (filter === "Weekly") {
      appointmentsQuery = `
        SELECT WEEK(appointmentDate) as label, COUNT(*) as value
        FROM appointments
        GROUP BY WEEK(appointmentDate)
        ORDER BY WEEK(appointmentDate)
      `;
      incomeQuery = `
        SELECT WEEK(appointmentDate) as label, SUM(Price) as value
        FROM appointments
        GROUP BY WEEK(appointmentDate)
        ORDER BY WEEK(appointmentDate)
      `;
    } else if (filter === "Monthly") {
      appointmentsQuery = `
        SELECT MONTH(appointmentDate) as label, COUNT(*) as value
        FROM appointments
        GROUP BY MONTH(appointmentDate)
        ORDER BY MONTH(appointmentDate)
      `;
      incomeQuery = `
        SELECT MONTH(appointmentDate) as label, SUM(Price) as value
        FROM appointments
        GROUP BY MONTH(appointmentDate)
        ORDER BY MONTH(appointmentDate)
      `;
    }

    // Run queries - adjust destructuring based on your DB lib!
    const [appointments] = await db.query(appointmentsQuery);
    const [income] = await db.query(incomeQuery);

    console.log("Appointments raw:", appointments);
    console.log("Income raw:", income);

    const formatMonth = (num) => {
      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];
      return months[num - 1] || num;
    };

    const formattedAppointments = appointments.map(item => ({
      label: filter === "monthly" ? formatMonth(item.label) : item.label,
      value: Number(item.value) || 0
    }));

    const formattedIncome = income.map(item => ({
      label: filter === "monthly" ? formatMonth(item.label) : item.label,
      value: Number(item.value) || 0
    }));

    res.json({
      appointments: formattedAppointments,
      income: formattedIncome,
      services: []
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Dashboard error" });
  }
};