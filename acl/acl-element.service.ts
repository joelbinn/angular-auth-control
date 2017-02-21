import {Injectable, ElementRef} from '@angular/core';
import {ReplaySubject, Subject, Observable} from 'rxjs';

@Injectable()
export class AclElementService {
  static readonly ACL_ID_ATTR = '__jb_ACL_ID';
  static aclIdSeq: number = 1;

  private aclStorage: {[key: string]: string[]} = {};
  private aclSubject: Subject<void> = new ReplaySubject<void>(1);

  createAclId(el:ElementRef):string {
    const elm = el.nativeElement;
    if (this.getAclId(el) === null) {
      elm.setAttribute(AclElementService.ACL_ID_ATTR, elm.nodeName + '#acl-id-'+(AclElementService.aclIdSeq++));
    }
    return this.getAclId(el);
  }

  getAclId(el:ElementRef):string {
    return el.nativeElement.getAttribute(AclElementService.ACL_ID_ATTR);
  }

  unregister(aclId:string):void {
    delete this.aclStorage[aclId];
  }

  getObservable():Observable<void> {
    return this.aclSubject.asObservable();
  }

  getRequiredAuthorizations(aclId:string):string[] {
    return this.aclStorage[aclId];
  }

  maybeRefresh(aclId:string, requiredAutorizations:string[]) {
    if (unequal(this.aclStorage[aclId], requiredAutorizations)) {
      this.aclStorage[aclId] = [].concat(requiredAutorizations);
      this.aclSubject.next();
    }

    function unequal(arr1: string[], arr2: string[]): boolean {
      if (arr1 === undefined && arr2 === undefined) {
        return false;
      } else if (arr1 === null && arr2 === null) {
        return false;
      } else if (arr1 === null || arr1 === undefined) {
        return true;
      } else if (arr2 === null || arr2 === undefined) {
        return true;
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

}
