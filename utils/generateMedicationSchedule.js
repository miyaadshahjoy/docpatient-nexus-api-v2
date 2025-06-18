// utils/generateMedicationSchedule.js
// Generate medication schedule from a prescription

const generateMedicationSchedule = (prescription, patient) => {
  const reminders = [];
  const startDate = new Date(prescription.createdAt || Date.now());
  if (
    !prescription ||
    !Array.isArray(prescription.medications) ||
    !patient ||
    !patient.email
  )
    throw new Error('Invalid prescription or patient data provided.');

  for (const med of prescription.medications) {
    /*{
        "name": "Paracetamol",
        "dosage": "500mg",
        "frequency": ["08:00", "14:00", "20:00"],
        "duration": 5,
        "instruction": "Take after meals"
    },*/
    // Check if the medication is valid
    const { name, dosage, frequency, duration, instruction } = med;
    if (
      !name ||
      !dosage ||
      !frequency ||
      !duration ||
      !Array.isArray(frequency)
    ) {
      console.warn('⚠ Skpping invalid medication: ', med);
      // continue;
    }

    for (let day = 0; day < duration; day += 1) {
      // "frequency": ["08:00", "14:00", "20:00"],
      for (const timeStr of frequency) {
        if (!/^\d{2}:\d{2}$/.test(timeStr)) {
          console.warn(`⚠ Invalid time format ${timeStr}. Skipping...`);

          continue;
        }
        // timeStr -> "08:00"
        const [hour, minute] = timeStr.split(':').map(Number);

        const reminderDate = new Date(startDate);
        reminderDate.setDate(reminderDate.getDate() + day);
        reminderDate.setHours(hour, minute, 0, 0);

        reminders.push({
          name,
          dosage,
          instruction,
          patient: patient.email,
          scheduledFor: reminderDate,
        });
      }
    }
  }
  return reminders;
};

module.exports = generateMedicationSchedule;
