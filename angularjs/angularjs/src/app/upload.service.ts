import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UploadService {
    //Upload service constructor
    constructor(private _http: Http) {
    }
    /**
     * Description: Method to insert the formatted CSV file into database
     * @param allRows 
     * @param fileName 
     */
    getDataRecordsArrayFromCSVFile(allRows, fileName): Observable<any[]> {
        return this._http.post('http://localhost:3000/uploadExcelFile', { 'lines': allRows, 'name': fileName })
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }
    /**
     * Descripiton: Method to handle errors
     * @param error 
     */
    public handleError(error: Response) {
        console.log(error);
        return Observable.throw(error);
    }
    /**
     * Description: Method to get all the upload CSV file records
     */
    getExcelRecords(): Observable<any[]> {
        return this._http.get('http://localhost:3000/getExcelRecords')
            .map((res: Response) => res.json());
    }
    /**
     * Description: Method to get single record based on id
     * @param id 
     */
    getExcelRecord(id: string) {
        return this._http.post('http://localhost:3000/getExcelRecord', { '_id': id })
            .map((res: Response) => res.json());
    }
}