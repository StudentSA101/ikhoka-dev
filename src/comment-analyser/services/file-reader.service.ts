import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FILE_READER_DIRECTORY, FILE_READER_EXTENSION } from '../comment-analyzer.constant';
import { CommentAnalyzer } from './entity/comment-analyzer.entity';
import { ReaderInterface } from './interfaces/reader.interface';

@Injectable()
export class FileReaderService implements ReaderInterface {
    public readData: CommentAnalyzer[] = [];
    constructor(@Inject(FILE_READER_DIRECTORY) private readonly directory: string, @Inject(FILE_READER_EXTENSION) private readonly EXTENSION: string) { }
    public async read(name: string, id: string): Promise<CommentAnalyzer[]> {
        return new Promise<CommentAnalyzer[]>((resolve, reject) => {
            fs.readFile(
                `${this.directory}/${name}`,
                async (error: NodeJS.ErrnoException | null, data: Buffer) => {
                    if (error) {
                        return reject(new HttpException('There is something wrong with the file format', HttpStatus.UNPROCESSABLE_ENTITY));
                    }
                    let index: number = this.readData.findIndex(item => item.id === id);
                    if (index === -1) {
                        this.readData.push({
                            id: id,
                            data: {
                                totalLinesShorterThan15: 0,
                                totalLinesWithWordMover:  0,
                                totalLinesWithWordShaker: 0,
                                totalLinesWithQuestionMark: 0,
                                totalLinesWithSpam: 0
                            }
                        }) 
                        index = this.readData.length - 1
                    }
                    for (const value of data.toString().split("\n")) {
                        this.readData[index].data.totalLinesShorterThan15 += await this.parseLineShorterThan15(value)
                        this.readData[index].data.totalLinesWithWordMover += await this.parseLineContains(value, 'Mover')
                        this.readData[index].data.totalLinesWithWordShaker += await this.parseLineContains(value, 'Shaker')
                        this.readData[index].data.totalLinesWithQuestionMark += await this.parseLineContains(value, '?')
                        this.readData[index].data.totalLinesWithSpam += await this.parseLineContainsUrl(value)
                    }
                    return resolve(this.readData);
                },
            );
        });
    }

    public async readDirectory(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(this.directory, (error: NodeJS.ErrnoException | null, files: []) => {
                if (error) {
                    reject(new HttpException('There is something wrong with the file format', HttpStatus.UNPROCESSABLE_ENTITY));
                }
                const targetFiles = files.filter(file => {
                    return path.extname(file).toLowerCase() === this.EXTENSION;
                });
                resolve(targetFiles);
            })
        })
    }

    public async parseLineShorterThan15(line: string): Promise<number> {
        return new Promise<number>((resolve) => {
            if (line.length < 15) {
                return resolve(1);
            }
            return resolve(0);
        })
    }

    public async parseLineContains(line: string, word: string): Promise<number> {
        return new Promise<number>((resolve) => {
            if (line.toLowerCase().includes(word.toLowerCase())) {
                return resolve(1)
            }
            return resolve(0);
        })
    }

    public async parseLineContainsUrl(line: string): Promise<number> {
        return new Promise<number>((resolve) => {
            if (line.match(/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi)) {
                return resolve(1)
            }
            return resolve(0);
        })
    }


}

