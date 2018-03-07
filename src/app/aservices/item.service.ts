import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable} from "angularfire2/database-deprecated";
import { AngularFireAuth} from 'angularfire2/auth';
import { Likes } from './Likes';
import { AuthService } from './auth.service';
 
@Injectable()
export class ItemService {

  likesCollection: FirebaseListObservable<Likes[]> = null ;
  public userId: string; 

  constructor(private afs: AngularFireDatabase, 
    private authService: AuthService) {
this.authService.user.subscribe(user => {
      if(user) this.userId = user.uid 
     });
}

   getListLike() {
    if (!this.userId) return;
    this.likesCollection = this.afs.list(`likes/${this.userId}`);
    return this.likesCollection
  }


  create(like: Likes){
    this.likesCollection.push(like);
  }

  deleteLikes(key: string){
    this.likesCollection.remove(key);
  }

}
