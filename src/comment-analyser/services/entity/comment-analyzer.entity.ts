export class CommentAnalyzer {
    id: string;
    data: {
        totalLinesShorterThan15: number,
        totalLinesWithWordMover: number,
        totalLinesWithWordShaker: number,
        totalLinesWithQuestionMark: number,
        totalLinesWithSpam: number
    }
}