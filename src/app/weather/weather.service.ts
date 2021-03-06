import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ApikeyService} from './../apikey/apikey.service';

@Injectable()
export class WeatherService {

  public apiForecast : String = "http://api.openweathermap.org/data/2.5/forecast";
  public apiCurrent : String = "http://api.openweathermap.org/data/2.5/weather";
  public key : String = "macle";
  public key_url : String;
  public requestUrl : String;
  public params : String = "&q=Talence,Fr&units=metric&lang=fr";
  public http : any;
  public apikeyService : any;

  constructor(http:Http,apikeyService:ApikeyService) {
    this.http = http;
    this.apikeyService = apikeyService;
    this.key = this.apikeyService.getKey('weather');
    this.key_url = '?APPID='+this.key;
  }

  getCurrent() {
      return this.http.get(this.apiCurrent+''+this.key_url+''+this.params)
        .map(res => res.json());
  }

  getForecast() {
      return this.http.get(this.apiForecast+''+this.key_url+''+this.params)
        .map(res => res.json());
  }
}
