import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-V');

  constructor(private router: Router) {}

  protected get showNavbar(): boolean {
    return !this.router.url.startsWith('/login') && !this.router.url.startsWith('/register');
  }
}
