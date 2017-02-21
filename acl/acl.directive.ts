import {Directive, ElementRef, AfterViewInit, Input, OnInit, OnDestroy, DoCheck} from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';

let aclIdSeq: number = 1;

let aclStorage: {[key: string]: string[]} = {};
const aclSubject: Subject<void> = new ReplaySubject<void>(1);

@Directive({selector: '[jbReqAuth]'})
export class AclDirective implements OnInit, OnDestroy, DoCheck {
  // TODO hur få uppdateringar i value om det är en funktion?

  @Input('jbReqAuth')
  value: string[];
  private aclId: string;

  constructor(private el: ElementRef) {
    this.aclId = getAclId(this.el.nativeElement, true);
  }

  ngOnInit(): void {
    aclStorage[this.aclId] = [].concat(this.value);
    console.debug('Registered jbReqAuth value:', this.aclId, '->', this.value);
    aclSubject.next();
    console.debug('ACL storage:', aclStorage);
  }

  ngDoCheck(): void {
    if (unequal(aclStorage[this.aclId], this.value)) {
      aclStorage[this.aclId] = [].concat(this.value);
      console.debug('ACL changed:', this.aclId, '->', this.value);
      aclSubject.next();
    }

    function unequal(arr1: string[], arr2: string[]): boolean {
      if (arr1 === undefined && arr2 === undefined) {
        return false;
      } else if (arr1 === null && arr2 === null) {
        return false;
      } else if (arr1.length !== arr2.length) {
        return true;
      } else {
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) {
            return true;
          }
        }
        return false;
      }
    }
  }

  ngOnDestroy(): void {
    delete aclStorage[this.aclId];
    console.debug('Unregistered jbReqAuth value:', this.aclId);
    console.debug('ACL storage:', aclStorage);
  }
}

function getAclId(elm: Element, create?: boolean): string {
  if (elm.getAttribute('__jb_ACL_ID') === null && create) {
    elm.setAttribute('__jb_ACL_ID', elm.nodeName + '#' + (aclIdSeq++));
  }

  return elm.getAttribute('__jb_ACL_ID');
}

enum AclState {
  HIDE,
  DISABLE,
  ENABLE
}

abstract class AclElement {
  constructor(private baseElement: ElementRef) {
    aclSubject.asObservable().subscribe(() => {
      this.refreshState(this.calculateState(this.requiredAuthorizations()))
    });
  }

  protected abstract refreshState(state:AclState): void;

  private calculateState(requiredAuthorizations: string[][]):AclState {
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
      const possibleAclId = getAclId(ne);
      if (possibleAclId) {
        const acl: string[] = aclStorage[possibleAclId];
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

@Directive({selector: 'button'})
export class AclButtonDirective extends AclElement {
  constructor(private el: ElementRef) {
    super(el);
  }

  protected refreshState(state:AclState): void {
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
@Directive({selector: 'div'})
export class AclDivDirective extends AclElement {
  constructor(private el: ElementRef) {
    super(el);
  }

  protected refreshState(state:AclState): void {
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

export const ACL_DIRECTIVES:any[] = [AclDirective, AclButtonDirective, AclDivDirective];
