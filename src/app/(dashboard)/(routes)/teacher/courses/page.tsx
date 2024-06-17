import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { columns } from "./_components/columns";

export default async function page() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      {/* <Link href={"course/create"}>
        <Button>New course</Button>
      </Link> */}
      <DataTable columns={columns} data={course} />
    </div>
  );
}
