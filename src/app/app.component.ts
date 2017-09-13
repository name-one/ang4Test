import { Component, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { DataService } from './data.service';
import { Action } from './models/action';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sendError;
  message = [{ message: 'default'}]; // defalt value to fix angular isue https://github.com/angular/angular/issues/17572
  sendWarning;
  success: number;
  newNode: number;
  action: Action;

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

      /* parse actions */
      let response = resp.json();
        switch(response.payload.action){
          case 'bind':
            this.bindNodes(response.payload.src, response.payload.dst)
            break;
          case 'unbind':
            this.unbindNodes(response.payload.src, response.payload.dst)
            break;
        }
      /* parse actions */
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
  bindNodes(src: number, dst:number){
    this.action = new Action('bind', src, dst);
  };
  unbindNodes(src: number, dst:number){
    this.action = new Action('unBind', src, dst);
  }
  handleError(err){
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
  createMessage(event){
    this.message = event
  }
}
