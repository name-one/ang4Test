import { Component } from '@angular/core';

import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(private dataService: DataService){}
  public go():void{
    this.dataService.getCommand().subscribe( (resp)=>{
      let response = resp.json();
      /* check errors */
        if(response.warnings.length || response.errors.length){
          /* check err */
        }else{
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
          }
          /* parse command */
        }
      /* check errors */

    });
  }
  public requestLink():void{
    this.dataService.requestLink().subscribe(resp=>{
      console.log(resp)
    })
  }
  public requestelEment():void{
    this.dataService.requestElement().subscribe(resp=>{
      console.log(resp)
    })
  }
}
