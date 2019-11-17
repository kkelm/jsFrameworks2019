import { Component, HostBinding, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

import { transition, animate, style, trigger, state, keyframes } from '@angular/animations';
import { delay } from 'q';
import { promise } from 'protractor';

interface QuizDisplay {
    name: string;
    questionCount: number;
    questions: object;
    markedForDelete: boolean;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: ['./app.component.css'],
    /*
    animations: [
        trigger(
            'showMessage', 
            [
                state('open', style({backgroundColor: 'grey', opacity: 1})),
                state('closed', style({opacity: 0})),

                transition('open => closed', [animate('1s')]),
                transition('closed => open', [animate('2s')])
            ]
        )
    ]
    */



    animations: [
        trigger('showMessage', [
            state('open', style({ opacity: 1 }))
            , state('closed', style({ opacity: 0 }))
            , transition('open => closed', [ animate('3s') ])
            //transition('closed => open', [ animate('1s') ]),
        ]),
      ]
})

export class AppComponent implements OnInit {

    loadingProgress = 100;

    isOpen = true;

    title = 'quiz-editor';
    //propName = 'purple';
    propName = Math.random() > 0.5 ? 'green' : 'yellow';
    borderRadius = '15px';
    dropShadow = '5px 5px 10px #555';

    toolTipText = `The color is ${this.propName}`;

    innerText = 'Property Binding';

    quizzes: QuizDisplay[] = [];
    quizName = '';

    failedToLoad = false;

    selectedQuiz = undefined;

    successMessage = null;

    constructor(private quizService: QuizService) {}

    ngOnInit() {
        /* 
        //Web Service
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
        // Local Array

        const loadQuizzesPromise = new Promise((resolve, reject) => {

            this.quizzes = this.quizService.loadQuizzes()
            .map(q => ({name: q.name, questionCount: q.questions.length, questions: q.questions, markedForDelete: q.markedForDelete}));

            if(this.quizzes.length > 0) {
                resolve(this.quizzes);
            } else {
                reject('Failed loadQuizzes');
            }
        });

        loadQuizzesPromise.then(p => console.log(p));

        // console.log(this.quizzes);
    }

    selectQuiz(quiz) {
        this.selectedQuiz = quiz;
        this.quizName = this.selectedQuiz.name;
    }

    addQuiz() {
        const newQuiz = { name: 'Untitled Quiz', questionCount: 0, questions: [], markedForDelete: false};
        this.quizzes = [...this.quizzes, newQuiz];
        this.selectQuiz(newQuiz);
    }

    addQuestion(newQuestion) {

        this.isOpen = !this.isOpen;
/*
       selectedQuiz = 
       this.quizzes
        .filter(quiz => selectedQuiz === quiz)
        .map(quiz => (
                {
                    name: quiz.name, 
                    questionCount: quiz.questionCount,
                    questions: [...selectedQuiz.questions, {name: newQuestion.value}]
                }
            )
        );

       this.quizzes =
        this.quizzes
        .reduce((updatedQuizzes, quizzes) => {

            if (quizzes.name === selectedQuiz[0].name) {
                selectedQuiz[0].questionCount = selectedQuiz[0].questions.length;
                quizzes = selectedQuiz[0];
            }

            updatedQuizzes.push(quizzes);

            return updatedQuizzes;
        }
        , []);

        this.selectQuiz(selectedQuiz[0]);
*/
        /**
         * Adds the new question to selected question by pushing the value of the 
         * new question to the selected question's questions property. Then updates 
         * the question count property, and returns an updated quizzes array.
        */ 
       /*
        this.quizzes = 
        this.quizzes
        .reduce((updatedQuizzes, quiz) => {

            if (quiz === selectedQuiz) {
                selectedQuiz.questions.push({name: newQuestion.value});
                selectedQuiz.questionCount = selectedQuiz.questions.length;
                quiz = selectedQuiz;
            }
            updatedQuizzes.push(quiz);

            return updatedQuizzes;
        }, []);
        */
        this.selectedQuiz.questions = [...this.selectedQuiz.questions, {name: newQuestion.value}];
        this.selectedQuiz.questionCount = this.selectedQuiz.questions.length;
        this.selectQuiz(this.selectedQuiz);
        // Clears the add question textbox.
        newQuestion.value = '';

        this.successMessage = 'Question Added';

        setTimeout(() => {
            this.successMessage = null;
        }, 3000);

        
    }

    deleteQuestion(event) {

        const id: number = Number(event.currentTarget.getAttribute('data-id'));

        this.selectedQuiz.questions = this.selectedQuiz.questions.filter((question, index) => index !== id ? question : '');
        /*
        this.selectedQuiz.questions = this.selectedQuiz.questions.filter((question, index) => {
            console.log(typeof(index) +'--'+ typeof(id));
            if (index !== id) {
                return question;
            }
        });
        */
        this.selectedQuiz.questionCount = this.selectedQuiz.questions.length;

        this.selectQuiz(this.selectedQuiz);
        
    }

    jsPromiseOne() {
        const x = this.quizService.getMagicNumberPromise(true);
        console.log(x);

        x.then(n => console.log(n))
        .catch(error => console.log(error))
        .finally(() => { console.log('Finally'); } );
    }

    async jsPromiseTwo() {

        try {
            const a = await this.quizService.getMagicNumberPromise(false);
            console.log(a);

            const b = await this.quizService.getMagicNumberPromise(true);
            console.log(b);
        }
        catch(err) {
            console.log(err);
        }
        

    }

    async jsPromiseThree() {

        try {
            const a = this.quizService.getMagicNumberPromise(true);
            console.log(a);

            const b = this.quizService.getMagicNumberPromise(true);
            console.log(b);

            // const results = await Promise.all([a, b]);
            const results = await Promise.race([a, b]);
            console.log(results);
        }
        catch(err) {
            console.log(err);
        }
        

    }

}
