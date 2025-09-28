import React from "react";

type Student = {
  id: number;
  name: string;
  assignedMentor?: string;
};

const AssignedMentors = ({ students }: { students: Student[] }) => (
  <section id="assigned-mentors" className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Assigned Mentors</h2>
    <div className="rounded-2xl shadow bg-white border border-blue-200 p-6 max-w-2xl">
      <table className="w-full text-left border-collapse bg-white">
        <thead>
          <tr className="bg-blue-100 text-blue-800">
            <th className="py-2 px-4 font-medium">Student</th>
            <th className="py-2 px-4 font-medium">Mentor</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} className="border-t border-blue-100">
              <td className="py-2 px-4">{student.name}</td>
              <td className="py-2 px-4">{student.assignedMentor || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default AssignedMentors;
