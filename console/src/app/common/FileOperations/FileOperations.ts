
import { saveAs } from 'file-saver';
import { FileFormat } from './FileFormat';


export class FileOperations { 

    readonly UNKNOWN_FORMAT: string = "UNKNOWN";
    readonly NON_SET_DELIMITER: string = "";
    // Note: File types
    readonly TEXT_FILE_TYPE: string = "text/plain;charset=utf-8";
    readonly JSON_FILE_TYPE: string = "application/json;charset=utf-8";

    
    // Defining empty constructor
    constructor() {}

    public saveFile(fileName: String, fileType: FileFormat, data: String, lineDelimiter: string = this.NON_SET_DELIMITER) {
        data = data.toString();
        var textFromFileInLines: string[] = data.split(lineDelimiter);
        let fileTypeTag: string = this.getFileTypeTag(fileType);
        let binaryFileData = new Blob(textFromFileInLines, { type: fileTypeTag});
        saveAs(binaryFileData, fileName);
    }

    private getFileTypeTag(fileType: FileFormat): string {
        switch (fileType) { 
            case FileFormat.TEXT:
                return this.TEXT_FILE_TYPE;
            case FileFormat.JSON: 
                return this.TEXT_FILE_TYPE;
        }
        return this.UNKNOWN_FORMAT; 
    }
}