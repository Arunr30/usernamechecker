import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsernameCheckerComponent } from './components/usernamecomponent/usernamecomponent';

@Component({
  selector: 'app-root',
  imports: [UsernameCheckerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('usernamecheck');
}
