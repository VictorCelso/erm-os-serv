import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {NgClass, NgIf} from '@angular/common';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, NgClass, MatSlideToggle, MatIcon, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'erm-os-serv';
  isDark = true;
  toggleDark() {
    this.isDark = !this.isDark;
  }
}
