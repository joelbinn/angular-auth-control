import {Directive, ElementRef, Input, OnDestroy, DoCheck} from '@angular/core';
import {AclElementService} from './acl-element.service';

@Directive({selector: '[jbReqAuth]'})
export class AclReqAuthDirective implements OnDestroy, DoCheck {
  @Input('jbReqAuth')
  value: string[];
  private aclId: string;

  constructor(private el: ElementRef, private aclElementService: AclElementService) {
    this.aclId = this.aclElementService.createAclId(this.el);
  }

  ngDoCheck(): void {
    this.aclElementService.maybeRefresh(this.aclId, this.value);
  }

  ngOnDestroy(): void {
    this.aclElementService.unregister(this.aclId);
  }
}
