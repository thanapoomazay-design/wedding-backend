import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./components/login/login";
import { SeatPlan } from "./components/seat-plan/seat-plan";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SeatPlan, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('booking-a-seat-frontend');
}
