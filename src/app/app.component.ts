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
  styles: ['./app.component.css']
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

    //questions = [];

    failedToLoad = false;



    constructor(private quizService: QuizService) {}

    ngOnInit() {
        /*
        this.quizService
        .loadQuizzes()
        .subscribe(
            data => {
                //this.quizzes.map(data => ({name: data.name, questionCount: data.questionCount, questions: data.questions}));
                //this.quizzes = Object.values(data).map(q => ({name: q.name, questionCount: q.questions.length, questions: q.questions}));
                this.quizzes = (<any[]> data).map(q => ({name: q.name, questionCount: q.questions.length, questions: q.questions}));
                console.log(data);

            },
            error => {
                console.error(error.error);
                this.failedToLoad = true;
            }
        );
        */
        this.quizzes = this.quizService.loadQuizzes().map(q => ({name: q.name, questionCount: q.questions.length, questions: q.questions}));
        //this.quizzes =  this.quizzes.map(quiz => [...this.quizzes, {questionCount: quiz}]);

        //console.log(this.quizzes);
    }

    selectedQuiz = undefined;

    selectQuiz(quiz) {
        this.selectedQuiz = quiz;
        this.quizName = this.selectedQuiz.name;
    }

    addQuiz() {
        const newQuiz = { name: 'Untitled Quiz', questionCount: 0, questions: []};
        this.quizzes = [...this.quizzes, newQuiz];
        this.selectQuiz(newQuiz);
        //console.log(this.quizzes);
    }

    addQuestion(selectedQuiz, newQuestion) {

        this.quizzes = this.quizzes
        .reduce((quizzes, quiz) => {

            if (quiz === selectedQuiz) {
                selectedQuiz.questions.push(newQuestion.value);
                selectedQuiz.questionCount = selectedQuiz.questions.length;
                quiz = selectedQuiz;
            }
            quizzes.push(quiz);

            return quizzes;
        }, []);

        this.selectQuiz(selectedQuiz);
        //console.log(this.quizzes);
        newQuestion.value = '';
    }

}
