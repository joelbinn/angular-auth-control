import {ElementRef} from '@angular/core';
import {AclElementService} from './acl-element.service';

export enum AclState {
  HIDE,
  DISABLE,
  ENABLE
}

export abstract class AclElement {
  constructor(private baseElement: ElementRef, private aclService: AclElementService) {
    this.aclService.getObservable()
      .subscribe(() => {
        this.refreshState(this.calculateState(this.requiredAuthorizations()))
      });
  }

  protected abstract refreshState(state: AclState): void;

  private calculateState(requiredAuthorizations: string[][]): AclState {
    // TODO get authorizations from service and compare with the required
    let flattened = requiredAuthorizations.reduce((all, e) => all.concat(e), []).filter(e => e !== null && e !== undefined);
    if (flattened.filter(e => e.indexOf('2017') >= 0).length > 0) {
      return AclState.ENABLE;
    }
    if (flattened.filter(e => e === 'Banankaka').length > 0) {
      return AclState.DISABLE;
    }
    return AclState.HIDE;
  }

  private requiredAuthorizations(): string[][] {
    let result: string[][] = [];
    let ne = this.baseElement.nativeElement;
    do {
      const possibleAclId = this.aclService.getAclId(this.baseElement);
      if (possibleAclId) {
        const acl: string[] = this.aclService.getRequiredAuthorizations(possibleAclId);
        if (acl !== null && acl !== undefined) {
          result.push(acl);
        }
      }
      ne = ne.parentElement;
    } while (ne);

    // The ACL from the topmost DOM elements is last
    return result;
  }
}
