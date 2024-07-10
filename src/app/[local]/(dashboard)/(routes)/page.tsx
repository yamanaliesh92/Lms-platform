import { CheckCircle, Clock } from "lucide-react";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import CoursesList from "../_components/course-list";
import InfoCard from "./_components/info-card";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "../../../../../action/get-dashboard-course";
import { getTranslations } from "next-intl/server";

export default async function Dashboard() {
  const t = await getTranslations("InfoCard");
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
          label={t("inProgress")}
          numberOfItems={courseInprogress.length}
        />

        <InfoCard
          icon={CheckCircle}
          label={t("completed")}
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...courseInprogress, ...completedCourses]} />
    </div>
  );
}
