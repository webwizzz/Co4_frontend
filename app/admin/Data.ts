// Centralized dummy data for mentors, students, and ideas

export interface Mentor {
  id: number;
  name: string;
  status: string;
}

export interface Student {
  id: number;
  name: string;
  status: string;
  report: "Best" | "Mediocre" | "Low";
  assignedMentor: string;
}

export interface Idea {
  id: number;
  title: string;
  description: string;
  status: "Approved" | "Pending" | "Rejected";
}

export const mentors: Mentor[] = [
  { id: 1, name: "Priya Sharma", status: "Pending" },
  { id: 2, name: "Amit Patel", status: "Active" },
  { id: 3, name: "Neha Gupta", status: "Active" },
];

export const students: Student[] = [
  { id: 1, name: "Ravi Kumar", status: "Active", report: "Best", assignedMentor: "Priya Sharma" },
  { id: 2, name: "Asha Singh", status: "Active", report: "Mediocre", assignedMentor: "Priya Sharma" },
  { id: 3, name: "Rahul Verma", status: "Active", report: "Low", assignedMentor: "Priya Sharma" },
  { id: 4, name: "Simran Kaur", status: "Active", report: "Best", assignedMentor: "Priya Sharma" },
];

export const ideas: Idea[] = [
  { id: 1, title: "Smart Attendance System", description: "A system to automate attendance using face recognition.", status: "Approved" },
  { id: 2, title: "E-Learning Platform", description: "A platform for online courses and quizzes.", status: "Pending" },
  { id: 3, title: "Health Tracker App", description: "An app to track daily health and fitness activities.", status: "Rejected" },
];
