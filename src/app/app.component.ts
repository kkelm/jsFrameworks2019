import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

interface QuizDisplay {
    name: string;
    questionCount: number;
    questions: object;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    title = 'quiz-editor';
    //propName = 'purple';
    propName = Math.random() > 0.5 ? 'green' : 'yellow';
    borderRadius = '15px';
    dropShadow = '5px 5px 10px #555';

    toolTipText = `The color is ${this.propName}`;

    innerText = 'Property Binding';

    quizzes: QuizDisplay[] = [];

    quizName = '';

    constructor(private quizService: QuizService) {}

    ngOnInit() {
        this.quizzes = this.quizService.loadQuizzes().map(q => ({name: q.name, questionCount: q.questionCount, questions: q.questions}));
        //this.quizzes =  this.quizzes.map(quiz => [...this.quizzes, {questionCount: quiz}]);

        console.log(this.quizzes);
    }

    selectedQuiz = undefined;
    selectQuiz(quiz) {
        this.selectedQuiz = quiz;

        this.quizName = this.selectedQuiz.name;
        //console.log(this.selectedQuiz.name);
    }

    addQuiz() {
        const newQuiz = { name: 'Untitled Quiz', questionCount: 0};
        this.quizzes = [...this.quizzes, newQuiz];
        this.selectQuiz(newQuiz);
        console.log(this.quizzes);
    }

}
