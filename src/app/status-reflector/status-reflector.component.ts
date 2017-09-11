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
  @Input()
  warnings;
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
    else if(changes.warnings && this.warnings != undefined){
      console.log('warning')
      changes.warnings.currentValue.forEach(item=>{
        this.addWarning(item.code)
      })
    }
  }
  addError(errorCode){
    let message= 'Error: ';
    this.responseCode[errorCode] ? message += ResponseCode[errorCode] : message += 'unknown error!';
    let errNotification = new Notification(notificationType.Error, message);
    this.notifications.push(errNotification);
  }
  addWarning(warningCode){
    let message= 'Warning: ';
    this.responseCode[warningCode] ? message += ResponseCode[warningCode] : message += 'unknown warning!';
    let errNotification = new Notification(notificationType.Warning, message);
    this.notifications.push(errNotification);
  }
}
