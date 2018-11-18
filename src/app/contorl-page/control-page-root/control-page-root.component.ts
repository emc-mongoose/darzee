import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-page-root',
  templateUrl: './control-page-root.component.html',
  styleUrls: ['./control-page-root.component.css']
})
export class ControlPageRootComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onNavigateNextClicked() { 
    this.router.navigate(["/editing-scenarios"])
  }

  onNavigatePreviousClicked() { 
    this.router.navigate(["/nodes"])
  }
}
