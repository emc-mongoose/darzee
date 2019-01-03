import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-runs',
  templateUrl: './runs.component.html',
  styleUrls: ['./runs.component.css']
})
export class RunsComponent implements OnInit {

  version = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  deleteSelected() {
    // TODO
  }

  onNavigateNewRun() {
    this.router.navigate(['/nodes']);
  }

}
