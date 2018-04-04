import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  symbol

  constructor(
    public route: ActivatedRoute
  ) {
    this.symbol = this.route.snapshot.paramMap.get('id');
    console.log(this.symbol);
   }

  ngOnInit() {
  }

}
