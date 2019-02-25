import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  readonly buttonRoutes = [
    // TODO: Add actual links to the pages once they'd be created
    {linkName: 'Runs', url: '/runs'},
    {linkName: 'New run', url: '/setup'},
    {linkName: 'Create scenario', url: '/control'}
  ]

  constructor() { }

  ngOnInit() { }

}
