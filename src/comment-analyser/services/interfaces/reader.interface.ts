import { CommentAnalyzer } from "../entity/comment-analyzer.entity";

export interface ReaderInterface {
    read(name:string, id: string): Promise<CommentAnalyzer[]>;
    readDirectory(): Promise<string[]>; 

}