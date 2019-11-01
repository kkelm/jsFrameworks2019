import { Component } from '@angular/core';
import { QuizService } from './quiz.service';

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
    dropShadow = '5px 5px 10px #555';

    toolTipText = `The color is ${this.propName}`;

    innerText = 'Property Binding';

    quizzes = [];

    constructor(private quizService: QuizService) {
        this.quizzes = this.quizService.loadQuizzes();
        console.log(this.quizzes);
    }

    selectedQuiz = undefined;
    selectQuiz(quiz) {
        this.selectedQuiz = quiz;
        console.log(this.selectedQuiz.name);
    }
}
