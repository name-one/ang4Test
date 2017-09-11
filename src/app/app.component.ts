import { Component } from '@angular/core';

import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sendError;
  sendWarning;

  constructor(private dataService: DataService){}
  go():void{
    let context = this;
    this.dataService.getCommand().subscribe( (resp)=>{
      /* check Warnings */
        this.handleWarning(resp);
      /* check Warnings */

      let response = resp.json();
          /* parse command */
          console.log(response)
          switch(response.payload.command){
            case 'request_command':
              this.go();
              break;
            case 'request_link':
              this.requestLink()
              break;
            case 'request_element':
              this.requestelEment();
              break;
          /* parse command */
        }
      /* check errors */

    },
    err=>{
      this.handleError(err)
    }
  );
  }
  requestLink():void{
    this.dataService.requestLink().subscribe(resp=>{
      /* check Warnings */
        this.handleWarning(resp);
      /* check Warnings */
      console.log(resp)
    },
    err=>{
      this.handleError(err)
    })
  }
  requestelEment():void{
    this.dataService.requestElement().subscribe(resp=>{
      /* check Warnings */
        this.handleWarning(resp);
      /* check Warnings */
      console.log(resp)
    },
    err=>{
      this.handleError(err)
    })
  }
  handleError(err){
    let error = err.json();
    this.sendError = error.errors;
  }
  handleWarning(resp):boolean{
    let response = resp.json();
    let warnings;
    if(response.warnings.length){
      this.sendWarning = response.warnings;
      return true
    }else{
      return false
    }
  }
}
