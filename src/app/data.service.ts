import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers} from '@angular/http';

import { environment } from '../environments/environment'

@Injectable()
export class DataService {

  constructor( private http: Http) { }

  public getCommand(){
    return this.get('command')
  }
  public requestLink(){
    return this.post('link', null)
  }
  public requestElement(){
    return this.post('element', null)
  }
  private getEndpoint(){
    return environment.endpoint
  }
  private createOptions(userName?: string, password?: string){
    let base64;
    let defaultName = 'test';
    let defaultPassword = '7MAzeHUEtsCTBBQ5';
    if((userName === null || userName === undefined)&&(password === null || password === undefined)){
      /*if we haven't userName and password */
      base64 = btoa(`${defaultName}:${defaultPassword}`);
    }else{
      /*if we haven userName and password */
      base64 = btoa(`${userName}:${password}`);
    }
    let auth = `Basic ${base64}`
    return new RequestOptions({
      headers: new Headers({"Authorization": auth, "Content-Type": "application/json"})
    })
  }
  private get(url: string){
    return this.http.get(this.getEndpoint()+url, this.createOptions());
  }
  private post(url, body){
    return this.http.post(this.getEndpoint()+url, body, this.createOptions());
  }
}
