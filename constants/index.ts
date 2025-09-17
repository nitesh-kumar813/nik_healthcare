export const GenderOptions = ["male", "female", "other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-Sneha.png",
    name: "Sneha gupta",
  },
  {
    image: "/assets/images/dr-Arjun.png",
    name: "Arjun Verma",
  },
  {
    image: "/assets/images/dr-Rohan.png",
    name: "Rohan Desai",
  },
  {
    image: "/assets/images/dr-Ananya.png",
    name: "Ananya Sharma",
  },
  {
    image: "/assets/images/dr-Vivek.png",
    name: "Vivek Nair",
  },
  {
    image: "/assets/images/dr-Priya.png",
    name: "Priya Mehta",
  },
  {
    image: "/assets/images/dr-Kavita.png",
    name: "Kavita Reddy",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
  {
    image: "/assets/images/dr-amit.jpg",
    name: "Amit yadav",
  },

];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
