import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      console.log('Access Granted');
      return true;
    } else {
      console.log('Access Denied');
      this.router.navigate(['/login']);
      // this.toast.error({detail: "ERROR", summary: "Please login first!", duration: 2000})
      return false;
    }
  }
  
  // canActivate():boolean{
  //     if (this.auth.isLoggedIn()){
  //       console.log("Access Granted")
  //       return true;
  //     }
  //     else{
  //       console.log("Access Denied")
  //       this.router.navigate(['/login'])
  //       return false
  //     }

  // }
  
};
