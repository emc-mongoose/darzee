import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  readonly buttonRoutes = [
    // TODO: Add actual links to the pages once they'd be created
    {linkName: 'Runs', url: '/'},
    {linkName: 'New run', url: '/'},
    {linkName: 'Scenarios', url: '/'},
    {linkName: 'Create scenario', url: '/'}
  ]

  constructor() { }

  ngOnInit() {
  }

}
