import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { Notification, notificationType } from '../models/notification';
import { ResponseCode } from '../models/response-code';
@Component({
  selector: 'app-status-reflector',
  templateUrl: './status-reflector.component.html',
  styleUrls: ['./status-reflector.component.scss']
})
export class StatusReflectorComponent implements OnInit, OnChanges {

  constructor() { }
  @Input()
  errors;
  notifications: Notification[] = [];
  responseCode = ResponseCode
  ngOnInit() {
    console.log(ResponseCode)
  }
  ngOnChanges(changes){
    if(changes.errors && this.errors != undefined){
      changes.errors.currentValue.forEach(item=>{
        this.addError(item.code)
      })
    }
  }
  addError(errorCode){
    let message= 'Error: ';
    this.responseCode[errorCode] ? message += ResponseCode[errorCode] : message += 'uncaught error!'
    let errNotification = new Notification(notificationType.Error, message)
    this.notifications.push(errNotification);
  }
}
