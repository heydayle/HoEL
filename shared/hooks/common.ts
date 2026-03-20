export const parseTextResult = (textResult: string) => {
    try {
        const cleanResult = textResult
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();
        return JSON.parse(cleanResult);
    } catch (e) {
        console.error('Failed to parse text_result:', e);
        return null;
    }
};