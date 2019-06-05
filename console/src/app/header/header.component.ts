import { Component, OnInit } from '@angular/core';
import { RoutesList } from '../modules/app-module/Routing/routes-list';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  readonly buttonRoutes = [
    // TODO: Add actual links to the pages once they'd be created
    {linkName: 'Runs', url: `/${RoutesList.RUNS}`},
    {linkName: 'New run', url: `/${RoutesList.MONGOOSE_SETUP}`},
    {linkName: 'Nodes', url: `/${RoutesList.NODES}`}
  ]

  constructor() { }

  ngOnInit() { }

}
