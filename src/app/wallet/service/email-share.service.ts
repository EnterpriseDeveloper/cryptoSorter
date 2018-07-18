import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database-deprecated";
import { AngularFireAuth} from 'angularfire2/auth';
import { EmailShare } from './EmailShare';
import { AuthService } from '../../aservices/auth.service';

@Injectable()
export class EmailShareService {

  emailShareColections: FirebaseListObservable<EmailShare[]> = null;
  userId: string;

  constructor(private afs: AngularFireDatabase, 
    private authService: AuthService) {
     this.authService.user.subscribe(user => {
      if(user) this.userId = user.uid 
     });
}



   getListOfEmailShare(path) {
     if (!this.userId) return;
     this.emailShareColections = this.afs.list('emailShareColections/' + this.userId +'/' + path);
     return this.emailShareColections;
   }

   setEmailShare(data){
     this.emailShareColections.push(data)
   }

   deleteEmailShare(key){
     this.emailShareColections.remove(key);
   }

   updateEmailShare(key, data){
     this.emailShareColections.update(key, {percent: data})
   }


}
