import { Component, EventEmitter } from '@angular/core';

import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sendError;
  sendWarning;
  success: number;
  newNode: number;
  constructor(private dataService: DataService){}
  go():void{
    let context = this;
    this.dataService.getCommand().subscribe( (resp)=>{
      /* check Warnings */
      let warningFlag =  this.handleWarning(resp);
      if(!warningFlag){
        this.handleSuccess()
      }

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
              this.requestElement();
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
      let warningFlag =  this.handleWarning(resp);
      if(!warningFlag){
        this.handleSuccess();
      }
      /* check Warnings */
      console.log(resp)
    },
    err=>{
      this.handleError(err)
    })
  }
  requestElement():void{
    this.dataService.requestElement().subscribe(resp=>{
      /* check Warnings */
        let warningFlag = this.handleWarning(resp);
        if(!warningFlag){
          this.handleSuccess();
        }
      /* check Warnings */
      let response = resp.json();
      this.newNode = response.payload.id

    },
    err=>{
      this.handleError(err)
    })
  }
  handleError(err){
    /*
      still not working!!!!!!!!!!!!!!!
    */
    if( err[0] && err[0].internal ){ //check type of error
      this.sendError = err
    }else{
      let error = err.json();
      this.sendError = error.errors;
    }

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
  handleSuccess(){
    this.success = Date.now() //just change value to changes
  }
}
