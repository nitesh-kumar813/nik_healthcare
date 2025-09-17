"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import {  parseStringify } from "../utils";

/* ---------------------- SEND EMAIL  ---------------------- */
const sendRequestEmail = async (to: string, name: string,doctor: string, schedule: Date) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendMail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        subject: "Appointment Request Received",
        text: `Hello ${name}, we have received your appointment request for Dr. ${doctor} on ${schedule.toDateString()}. You will get a confirmation soon.`,
      }),
    });
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

const sendConfirmationEmail = async (
  to: string,
  name: string,
  doctor: string,
  schedule: Date
) => {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendMail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to,
      subject: "Appointment Confirmed",
      text: `Hello ${name}, your appointment has been confirmed for ${schedule.toDateString()} with Dr. ${doctor}.`,
    }),
  });
};

const sendCancellationEmail = async (
  to: string,
  name: string,
  doctor: string,
  schedule: Date,
  reason: string
) => {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendMail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to,
      subject: "Appointment Cancelled",
      text: `Hello ${name}, your appointment with Dr. ${doctor} on ${schedule.toDateString()} has been cancelled. Reason: ${reason}`,
    }),
  });
};


export const sendSMSNotification = async (phone: string, message: string) => {
  try {
    console.log("📤 Sending SMS:", phone, message);
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendSms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phone, message }),
    });
  } catch (error) {
    console.error("❌ SMS error:", error);
  }
};

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    
    if (appointment.email && appointment.name) {
      console.log("📩 Sending Email to", appointment.email);
      await sendRequestEmail(appointment.email, appointment.name,appointment.primaryPhysician,appointment.schedule);
    }

  
    if (appointment.phone && appointment.name) {
      console.log("📲 Sending SMS to", appointment.phone);
      await sendSMSNotification(
        appointment.phone,
        `Hello ${appointment.name}, your appointment request for Dr. ${appointment.primaryPhysician} on ${appointment.schedule.toDateString()} has been received. You will get a confirmation soon.`
      );
    }

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

//  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );


    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};


//  UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updated = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updated) throw Error;

    const updatedAppointment = updated as Appointment;
    const patient = updatedAppointment.patient;

    if (type === "schedule") {
      
      await sendConfirmationEmail(
        patient.email,
        patient.name,
        updatedAppointment.primaryPhysician,
        new Date(updatedAppointment.schedule)
      );
      await sendSMSNotification(
        patient.phone,
        `Hello ${patient.name}, your appointment has been confirmed for ${new Date(
          updatedAppointment.schedule
        ).toDateString()} with Dr. ${updatedAppointment.primaryPhysician}.`
      );
    }

    if (type === "cancel") {
      const reason = updatedAppointment.cancellationReason ?? "No reason provided";
      
      await sendCancellationEmail(
        patient.email,
        patient.name,
        updatedAppointment.primaryPhysician,
        new Date(updatedAppointment.schedule),
        reason
      );
      await sendSMSNotification(
        patient.phone,
        `Hello ${patient.name}, your appointment with Dr. ${
          updatedAppointment.primaryPhysician
        } on ${new Date(
          updatedAppointment.schedule
        ).toDateString()} has been cancelled. Reason: ${reason}`
      );
    }

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};
