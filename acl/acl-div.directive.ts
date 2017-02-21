import {Directive, ElementRef} from '@angular/core';
import {AclElementService} from './acl-element.service';
import {AclElement, AclState} from './acl-element';

@Directive({selector: 'div'})
export class AclDivDirective extends AclElement {
  constructor(private el: ElementRef, aclElementService: AclElementService) {
    super(el, aclElementService);
  }

  protected refreshState(state: AclState): void {
    switch (state) {
      case AclState.HIDE:
        this.el.nativeElement.style.backgroundColor = 'red';
        break;
      case AclState.DISABLE:
        this.el.nativeElement.style.backgroundColor = 'yellow';
        break;
      case AclState.ENABLE:
        this.el.nativeElement.style.backgroundColor = 'green';
        break;
    }
  }
}
