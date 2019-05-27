import { Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormat'
  })
  export class DateFormatPipe extends DatePipe implements PipeTransform {

    readonly DEFAULT_DATE_FORMAT = "yyyyMMdd.HHmmss.SS"; // NOTE: As for 01.04.2019, Mongoose's date format in load-step-id is yyyMMdd.HHmmss.SSS. 
    transform(value: any, args?: any): any {
       return super.transform(value, this.DEFAULT_DATE_FORMAT);
    }
  }
  