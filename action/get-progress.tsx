import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapter = await db.chapter.findMany({
      where: { courseId, isPublished: true },
      select: { id: true },
    });
    const publishedChaptersId = publishedChapter.map((chapter) => chapter.id);

    const validCompleteChapter = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChaptersId,
        },
        isCompleted: true,
      },
    });
    const progressPercentage =
      (validCompleteChapter / publishedChaptersId.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("error in progress", error);
    return 0;
  }
};
