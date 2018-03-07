import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable} from "angularfire2/database-deprecated";
import { AngularFireAuth} from 'angularfire2/auth';
import { Dislikes } from './Dislikes';
import { User } from './User';
import { AuthService } from './auth.service';


@Injectable()
export class DislikeService {

  dislikeCollection: FirebaseListObservable<Dislikes[]> = null ;
  userId : string;

  constructor(private afs: AngularFireDatabase, 
              private authService: AuthService) {
       this.authService.user.subscribe(user => {
                if(user) this.userId = user.uid 
               });
}

  

   getListDislike()  {
    if (!this.userId) return;
    this.dislikeCollection = this.afs.list(`dislikes/${this.userId}`);
    return this.dislikeCollection;
  }


  createDislike(dislike: Dislikes){
     this.dislikeCollection.push(dislike);
  }

  deleteDislike(key:string){
      this.dislikeCollection.remove(key)
  }



}


