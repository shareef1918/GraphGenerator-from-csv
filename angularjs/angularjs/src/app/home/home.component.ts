import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadService } from '../upload.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UploadService]
})

export class HomeComponent {
  public csvRecords: any[] = [];
  public uploadedExcelSheets: any[] = [];
  public allRows: any[] = [];
  public headerArray: any[] = [];
  constructor(private _uploadService: UploadService) {

  }
  ngOnInit() {
    //Subscribe all the uploaded excel sheets on initail state
    this._uploadService.getExcelRecords()
      .subscribe(
      data => this.uploadedExcelSheets = data
      )
  }
  /**
   * Description: Method to format the upload CSV file which intern use the upload service to upload the document 
   * @param  
   * Object Structure: Array of Obejcts
   * [{'year':1980,'score':27},{'year':1990,'score':56},...] for each line or row from CSV
   */
  fileChangeListener($event): void {
    var text = [];
    var files = $event.srcElement.files;
    if (this.isCSVFile(files[0])) {
      var input = $event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);
      var fileName = input.files[0].name.split('.')[0];
      reader.onload = (data) => {
        let csvData = reader.result;
        let csvRecordsArray = csvData.split(/\r\n|\n/);
        let columnRow = this.getColumnArray(csvRecordsArray);
        for (let i = 0; i < csvRecordsArray.length - 1; i++) {
          let singleRow: Object[] = [];
          var row = csvRecordsArray[i].split(',');
          row.shift();
          var splitRow = row.slice(',')
          for (let j = 0; j < splitRow.length; j++) {
            let pair = splitRow[j].split('|');
            let obj = {
              'year': pair[0],
              'score': pair[1]
            }
            singleRow.push(obj);
          }
          this.allRows.push(singleRow);
        }
        this._uploadService
          .getDataRecordsArrayFromCSVFile(this.allRows, fileName)
          .subscribe(
          data => { this.uploadedExcelSheets = data; $event.srcElement.value = null },
          err => console.log(err)
          );
      }
      reader.onerror = function () {
        alert('Unable to read ' + input.files[0]);
        return;
      };

    } else {
      alert("Please import valid .csv file.");
      return;
    }
  };
  /**
   * Description: Method to check the extension of uploaded file is CSV or not
   * @param file 
   */
  isCSVFile(file: any) {
    var fileName = file.name;
    var fileExtenson = fileName.substring(fileName.lastIndexOf('.') + 1);
    return (fileExtenson === 'csv') ? true : false;
  }
  /**
   * Description: Method to get series names in the form of an array
   * @param csvRecordsArr 
   */
  getColumnArray(csvRecordsArr) {
    let headers = csvRecordsArr[0].split('\n');
    for (let j = 0; j < csvRecordsArr.length; j++) {
      var record = csvRecordsArr[j].split(',');
      this.headerArray.push(record[0]);
    }
    return this.headerArray;
  }
}