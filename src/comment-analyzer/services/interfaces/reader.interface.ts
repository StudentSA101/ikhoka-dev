export interface ReaderInterface {
    read(name: string): string | Promise<string>;
    readDirectory(callback: object): string | Promise<string[]>;
  }