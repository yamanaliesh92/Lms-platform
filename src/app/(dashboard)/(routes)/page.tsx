import { CheckCircle, Clock } from "lucide-react";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import CoursesList from "../_components/course-list";
import InfoCard from "./_components/info-card";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "../../../../action/get-dashboard-course";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, courseInprogress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={courseInprogress.length}
        />

        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...courseInprogress, ...completedCourses]} />
    </div>
  );
}
