/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
  <div [jbReqAuth]="['kaka']" data-rotmos>
    <h4>ACL exempel</h4>

    <div [jbReqAuth]="auth">
      Auth: {{auth|json}} <button md-raised-button (click)="changeAuth()">Uppdatera auth</button>
    </div>
    <br>
    <form (ngSubmit)="submit()" autocomplete="off">
      <input
        datatype="text"
        [(ngModel)]="value"
        placeholder="En sträng"
        name="value"
        autofocus>
      <button md-raisebutton color="primary">Submit Value</button>
    </form>
  </div>
 `
})
export class AppComponent {
  value: string;
  private auth: string[] = ['Banankaka'];

  constructor() {
  }

  submit(): void {
    console.debug('Submit:', this.value);
  }

  changeAuth(): void {
    console.debug("Changing auth");
    this.auth.push(new Date().toISOString())
  }

}
