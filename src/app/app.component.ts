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

        console.log(this.quizzes);
    }

    selectedQuiz = undefined;
    quizQuestions = undefined;
    questions = undefined;

    selectQuiz(quiz) {
        this.selectedQuiz = quiz;
        this.quizName = this.selectedQuiz.name;
        this.questions = this.selectedQuiz.questions;
        //this.selectQuestions(this.selectedQuiz);

        //console.log(this.selectedQuiz.name);
    }

    addQuiz() {
        const newQuiz = { name: 'Untitled Quiz', questionCount: 0, questions: []};
        this.quizzes = [...this.quizzes, newQuiz];
        this.selectQuiz(newQuiz);
        //console.log(this.quizzes);
    }

    

    selectQuestions(quiz) {
        //this.quizQuestions = quiz.questions;
    }

    addQuestion(newQuestion) {

        console.log(newQuestion.value);

        //console.log(this.quizQuestions);

/*
        this.quizzes
        .filter(selectedQuiz => selectedQuiz === this.selectedQuiz)
        .map(quiz => [...(<any[]>quiz.questions), newQuestion.value]);

        console.log(this.quizzes);
*/
        
        this.questions = [...this.questions, newQuestion.value];
        console.log(this.questions);

        this.quizzes
        .filter(selectedQuiz => selectedQuiz === this.selectedQuiz)
        .map(quiz => ({name: quiz.name, questionCount: this.questions.length, questions: this.questions}))
        .map(updatedQuiz => {
            this.quizzes.push(updatedQuiz);
        })
        ;

        this.quizzes = this.quizzes
        .reduce((acc, q) => {

            if (q !== this.selectedQuiz) {
                console.log(q);
                console.log(this.selectedQuiz);
                acc.push(q);
                
            }

            return acc;
        }, []);

        console.log(this.quizzes);
/*
        let newQuestions = quiz.map(quizQ => quizQ.questions = this.questions);

        newQuestions.map(questions => [...this.selectedQuiz, questions]);
*/
        newQuestion.value = '';
        //this.selectQuiz(newQuiz);
        //console.log(quizzes);
    }

}
