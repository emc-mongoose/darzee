import { Component } from '@angular/core';
import { RunDuration } from './core/run-duration';
import { start } from 'repl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mongoose-console';

  ngOnInit() {  }
}
