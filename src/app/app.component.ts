import { animate, state, style, transition, trigger } from '@angular/animations';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s 0.5s')
      ]),
    ]),
    trigger('openCloseDisplay', [
      state('open', style({
        display: 'flex'
      })),
      state('closed', style({
        display: 'none'
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0s 0.5s')
      ]),
    ])
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ImageOverlap';
  toggleUploader: boolean = false;

  resourceUrl?:string;

  setNewSrc(newSrc : string){
    this.resourceUrl = newSrc;
  }

  continue(){
    this.toggleUploader = true;
  }
}
