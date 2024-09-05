import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ComparisonComponent} from "./comparison/comparison.component";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ComparisonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dynamic-programming-view';
}
