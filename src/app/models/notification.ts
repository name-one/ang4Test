export class Notification {
  constructor( public type: notificationType, public message: string){}
}
export enum notificationType{
  Error = 0,
  Warning = 1,
  Message = 2,
  Success = 3
}
