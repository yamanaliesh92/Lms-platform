import React from "react";
import { auth } from "@clerk/nextjs/server";
import Chart from "./_components/chart";
import DataCard from "./_components/data-card";
import { redirect } from "next/navigation";
import { getAnalytics } from "../../../../../../action/getAnalytics";

export default async function page() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  const newLocal = "Total Sales";
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
        <DataCard label={newLocal} value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
}
