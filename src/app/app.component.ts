import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quiz-editor';
  //propName = 'purple';
  propName = Math.random() > 0.5 ? 'green' : 'yellow';
  borderRadius = '15px';
  dropShadow = '5px 5px 10px blue';
}
