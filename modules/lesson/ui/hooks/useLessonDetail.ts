import { useState } from "react";
import { ILesson } from "../../core/models";
import { getLessonById } from "../../infras";

export const useLessonDetail = (lessonId: string) => {
    const [lesson, setLesson] = useState<ILesson | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch lesson details by ID
    const fetchLessonDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await getLessonById(lessonId).then((data) => {
                if (data) {
                    setLesson(data);
                } else {
                    setError("Lesson not found");
                }
            });
        } catch (err: unknown) {
            setError((err as Error).message || "Failed to fetch lesson details");
        } finally {
            setIsLoading(false);
        }
    };

    return { lesson, isLoading, error, fetchLessonDetail };
}