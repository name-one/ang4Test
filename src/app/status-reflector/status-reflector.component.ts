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
  @Input()
  newSuccess;
  @Input()
  inputMessage;
  notifications: Notification[] = [];
  responseCode = ResponseCode
  ngOnInit() {

  }
  ngOnChanges(changes){
    console.log(changes)
    if(changes.errors && this.errors != undefined){
        changes.errors.currentValue.forEach(item=>{
          item.internal ? this.addError(item.code) : this.addError(item.code, true);
        })

    }
    else if(changes.warnings && this.warnings != undefined){
      changes.warnings.currentValue.forEach(item=>{
        this.addWarning(item.code)
      })
    }
    else if(changes.newSuccess){
      this.addSuccess()
    }else if(changes.inputMessage && this.inputMessage != undefined){
      changes.inputMessage.currentValue.forEach( item=>{
        this.addMessage(item.code)
      })
    }
  }
  addError(errorCode:string, fromApi?: boolean){
    if(fromApi){
      let message= 'Error: ';
      this.responseCode[errorCode] ? message += ResponseCode[errorCode] : message += 'unknown error!';
      let errNotification = new Notification(notificationType.Error, message);
      this.notifications.push(errNotification);
    }else{
      let errNotification = new Notification(notificationType.Error, errorCode);
      this.notifications.push(errNotification);
    }
  }
  addWarning(warningCode){
    let message= 'Warning: ';
    this.responseCode[warningCode] ? message += ResponseCode[warningCode] : message += 'unknown warning!';
    let errNotification = new Notification(notificationType.Warning, message);
    this.notifications.push(errNotification);
  }
  addSuccess(){
    let successNotification = new Notification(notificationType.Success, 'Happy request!');
    this.notifications.push(successNotification);
  }
  clear(){
    this.notifications = [];
  }
  addMessage(message: string){
    let messageNotification = new Notification( notificationType.Message, message)
    this.notifications.push(messageNotification);
  }
}
