import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {AclElementService} from './acl-element.service';
import {AclReqAuthDirective} from './acl-req-auth.directive';
import {AclButtonDirective} from './acl-button.directive';
import {AclDivDirective} from './acl-div.directive';

const ACL_DIRECTIVES: any[] = [
  AclReqAuthDirective,
  AclButtonDirective,
  AclDivDirective
];

@NgModule({
  declarations: [
    ACL_DIRECTIVES
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    AclElementService
  ],
  exports: [
    ACL_DIRECTIVES
  ]
})
export class AclModule {
}
