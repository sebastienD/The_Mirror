import {Component, OnInit, ElementRef} from "@angular/core";
import {ViewEncapsulation} from '@angular/core';
import {NgStyle} from '@angular/common';
import {XmlParsePipe} from '../pipes/xmlparse.pipe';
import {VcubService} from './vcub.service';
import {Observable}       from 'rxjs/Rx';
import {Http, Headers, Jsonp} from '@angular/http';
import {ConstantsService} from '../constants.service';


@Component({
  selector: "vcub",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./app/vcub/vcub.html",
  styleUrls: ["./app/vcub/vcub.css"],
  providers: [VcubService, ConstantsService],
  pipes: [XmlParsePipe]
})

export class VcubComponent implements OnInit {

  public stations: any[] = [];
  public http: Http;

  constructor(private vcubservice: VcubService, private constants : ConstantsService) {
  }

  ngOnInit() {
    console.log('Init vcub');
    this.recupererEtatStationsInitiale();
    this.recupererEtatStationsParIntervalle();
  }

  recupererEtatStationsInitiale() {
    Observable
      .from(this.getInfosStations())
      .subscribe((infosStation: any) => {
        this.ajoutNouvelleStation(infosStation);
      });
  }

  recupererEtatStationsParIntervalle() {
    Observable
      .from(this.polling())
      .subscribe((o: any) => {
        this.miseAJourStation(o);
      });
  }

  miseAJourStation(infosStation: any) {
    for (var station of this.stations) {
      if (station.NOM.__text == infosStation.CI_VCUB_P.NOM.__text) {
        this.miseAJourDonneesStation(station, infosStation);
      }
    }
  }

  polling() {
    return Observable
      .interval(this.constants.vcub_refresh_interval)
      .flatMap(() => {
        return this.getInfosStations();
      });
  }

  ajoutNouvelleStation(station : any) {
      this.stations.push(station.CI_VCUB_P);
  }

  miseAJourDonneesStation(station : any, nouvellesDonnees : any) {
        station.NBVELOS = nouvellesDonnees.CI_VCUB_P.NBVELOS;
        station.NBPLACES = nouvellesDonnees.CI_VCUB_P.NBPLACES;
        
  }
  getInfosStations() {
    return this.vcubservice.getBorneData();
  }
}
