import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Http, Response} from "@angular/http";

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { NotifyService } from './notify.service';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { User } from './User';
import "rxjs/Rx";


@Injectable()
export class AuthService {
  
  promise: any;
  user: Observable<User | null>;
  userPasword: any;
  positionGoogle: any;
  private URL = "https://geoip-db.com/json/";
  private dataLocation: any;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFireDatabase,
    private router: Router,
    private notify: NotifyService,
    private http: Http) {
    this.getPosition()
    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          return this.afs.object(`/users/${user.uid}`);
        } else {
          return Observable.of(null);
        }
      });
  }

  getPosition(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPositionData, showError);
    }

  var that = this
    function getPositionData(position) {
      that.positionGoogle = {
        accuracy: position.coords.accuracy,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    }

    function showError(error) {
      switch(error.code) {
          case error.PERMISSION_DENIED:
          that.getAPILocation().subscribe((data)=>{
            that.positionGoogle = data;
          })
              break;
          case error.POSITION_UNAVAILABLE:
                that.getAPILocation().subscribe((data)=>{
                that.positionGoogle = data;
                 })
              break;
          case error.TIMEOUT:
                that.getAPILocation().subscribe((data)=>{
                that.positionGoogle = data;
                })
              break;
          case error.UNKNOWN_ERROR: 
                that.getAPILocation().subscribe((data)=>{
                that.positionGoogle = data;
                })
              break;
      }
  }
  }

  getAPILocation(){
    return this.http         
    .get(this.URL)
    .map(res =>  res.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  ////// OAuth Methods /////
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.userPasword = 'not-found'
    return this.oAuthLogin(provider);
  }


  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    this.userPasword = 'not-found';
    return this.oAuthLogin(provider);
  }


  private oAuthLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.notify.style = 'success'
        return this.updateUserData(credential.user);
      })
      .catch((error) => this.handleError(error));
  }


  //// Email/Password Auth ////
  emailSignUp(email: string, password: string) {
    this.userPasword = password;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.notify.style = 'success'
        return this.updateUserData(user); // if using firestore
      })
      .catch((error) => this.handleError(error));
  }

  emailLogin(email: string, password: string) {
    this.userPasword = password;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.notify.style = 'success'
        return this.updateUserData(user); // if using firestore
      })
      .catch((error) => this.handleError(error));
  }

  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth.sendPasswordResetEmail(email)
      .then(() => this.notify.update('Password update email sent', 'info'))
      .catch((error) => this.handleError(error));
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    this.notify.update(error.message, 'error');
  }

  // Sets user data to firestore after succesful login
  private updateUserData(user: User) {

    const userRef: FirebaseObjectObservable<User> = this.afs.object(`/users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      password: this.userPasword,
      position: this.positionGoogle
    };
  
      return userRef.set(data);

  }


  findEmailUsers(data) {
      var query: any = this.afs.database.ref('/users').orderByChild('email').equalTo(data)
      return query;
  }

}


