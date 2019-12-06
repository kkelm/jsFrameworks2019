import { Component, HostBinding, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QuizService } from './quiz.service';

import { transition, animate, style, trigger, state, keyframes } from '@angular/animations';
import { delay } from 'q';
import { promise } from 'protractor';
import { exists } from 'fs';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { observable } from 'rxjs';
import { stringify } from 'querystring';

interface QuizDisplay {
    name: string;
    questionCount: number;
    questions: object;
    markedForDelete: boolean;
    newlyAddedQuiz: boolean;
    naiveQuizCheckSum: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: ['./app.component.css'],
    animations: [
        trigger('detailsFromLeft', [
            transition('leftPosition => finalPosition', [
                animate('300ms', keyframes([
                    style({ left: '-30px', offset: 0.0 }),
                    style({ left: '-20px', offset: 0.25 }),
                    style({ left: '-10px', offset: 0.5 }),
                    style({ left: '-5px', offset: 0.75 }),
                    style({ left: '0px', offset: 1.0 })
                ]))
            ]),
        ]),
        trigger('pulseSaveCancelButtons', [
            transition('nothingToSave => somethingToSave', [
                animate('400ms', keyframes([
                    style({ transform: 'scale(1.0)', 'transform-origin': 'top left', offset: 0.0 }),
                    style({ transform: 'scale(1.2)', 'transform-origin': 'top left', offset: 0.5 }),
                    style({ transform: 'scale(1.0)', 'transform-origin': 'top left', offset: 1.0 })
                ]))
            ])
        ]),

        trigger('showMessage', [
            state('open', style({ opacity: 1 }))
            , state('closed', style({ opacity: 0 }))
            , transition('open => closed', [ animate('3s') ])
            // transition('closed => open', [ animate('1s') ]),
        ]),
      ]
})

export class AppComponent implements OnInit {

    loadingProgress = 0;
    isOpen = true;

    @ViewChild('progressBar', {read: NgbProgressbar, static: true}) progressBar: NgbProgressbar;

    displayForm = false;





    title = 'quiz-editor';
    // propName = 'purple';
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
        // console.log(this.progressBar);
        // Web Service
/*
        await this.quizService.loadQuizzesFromApi()
        .then(observAble => {
             return observAble.subscribe(
                data => {
                    this.loadingProgress = 33;
                    this.progressBar.type = (this.loadingProgress < 50 ) ? 'danger' : 'warning';
                    this.quizzes = data.map(q => ({name: q.name, questionCount: q.questions.length, questions: q.questions, markedForDelete: q.markedForDelete}))
                }
                , e => {
                    console.error(e.error);
                }
            );
        })
        .then(quizzesMap => {
            this.loadingProgress = 66;
            this.progressBar.type = (this.loadingProgress < 50 ) ? 'danger' : 'warning';
        })
        .catch(error => console.error(error))
        .finally(() => {
            this.loadingProgress = 100;
            this.progressBar.type = 'success';
            this.progressBar.height = '0';
        });
*/

        // this.loadQuizzesFromApi();
        // Local Array
        this.loadQuizzes();
        
    }

    private loadQuizzesFromApi() {
        this.quizService.loadQuizzesFromApi()
            .then(observAble => {
                return observAble.subscribe(data => {
                    // this.loadingProgress = 33;
                    // this.progressBar.type = (this.loadingProgress < 50 ) ? 'danger' : 'warning';
                    // this.quizzes = data.map(q => ({name: q.name, questionCount: q.questions.length, questions: q.questions, markedForDelete: q.markedForDelete}))
                }, e => {
                    console.error(e.error);
                });
            })
            .then(quizzesMap => {
                // this.loadingProgress = 66;
                // this.progressBar.type = (this.loadingProgress < 50 ) ? 'danger' : 'warning';
            })
            .catch(error => console.error(error))
            .finally(() => {
            });
    }

    private loadQuizzes() {
        this.quizService.loadQuizzes()
            .then(data => {
                // this.loadingProgress = 33;
                // this.progressBar.type = (this.loadingProgress < 50 ) ? 'danger' : 'warning';
                const quizzes = data.map(q => ({ 
                    name: q.name
                    , questionCount: q.questions.length
                    , questions: q.questions
                    , markedForDelete: q.markedForDelete
                    , newlyAddedQuiz: false 
                    , naiveQuizCheckSum: this.generateNaiveQuizCheckSum(q)
                }));
                const increment = (quizzes.length / 4) * 10;
                this.loadingProgress = increment;
                //this.progressBar.height = '30px';
                const timer = setInterval(() => {
                    this.loadingProgress = (this.loadingProgress + increment) > 100 ? 100 : this.loadingProgress + increment;
                    if (this.loadingProgress < 100) {
                        //this.progressBar.type = (this.loadingProgress < 50) ? 'danger' : 'warning';
                    }
                    else {
                        this.loadingProgress = 100;
                        //this.progressBar.type = 'success';
                        //this.progressBar.height = '0';
                        this.displayForm = true;
                        clearInterval(timer);
                        this.quizzes = quizzes;
                    }
                }, 100);
            })
            .then(quizzesMap => {
                // this.loadingProgress = 66;
                // this.progressBar.type = (this.loadingProgress < 50 ) ? 'danger' : 'warning';
            })
            .catch(error => console.error(error))
            .finally(() => {
            });
    }

    generateNaiveQuizCheckSum(quiz) {
        return quiz.name + quiz.questions.map(q => '~' + q.name).join('');
    }

    get numberOfEditedQuizzes() {
        return this.getEditedQuizzes().length;
    }

    getEditedQuizzes() {
        return this.quizzes.filter( 
            q => this.generateNaiveQuizCheckSum(q) != q.naiveQuizCheckSum 
            && !q.newlyAddedQuiz && !q.markedForDelete
        );
    }

    cancelBatchEdits() {
        this.loadQuizzes();
        // this.loadQuizzesFromApi();
        this.selectedQuiz = undefined;
    }

    get numberOfAddedQuizzes() {
        return this.getAddeddQuizzes().length;
    }

    getAddeddQuizzes() {
        return this.quizzes.filter( q => q.newlyAddedQuiz);
    }

    get numberOfDeletedQuizzes() {
        return this.getDeletedQuizzes().length;
    }

    getDeletedQuizzes() {
        return this.quizzes.filter( q => q.markedForDelete);
    }

    selectQuiz(quiz) {
        this.selectedQuiz = quiz;
        this.quizName = this.selectedQuiz.name;
        this.detailsAnimationState = "finalPosition";
    }

    addQuiz() {
        const newQuiz = { 
            name: 'Untitled Quiz'
            , questionCount: 0
            , questions: []
            , markedForDelete: false
            , newlyAddedQuiz: true
            , naiveQuizCheckSum: ''
        };
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

    questionValues(questions) {
        const q = questions[0].map(question => question)
        .map(qz => qz.name);
        console.log(q);
        return q;
    }

    saveBatchEdits() {

        let newQuizzes: object[] = [
            {quizName: ''},
            {quizQuestions: []}
        ];

        console.log(this.quizzes);

        newQuizzes = this.quizzes
        .filter(quiz => quiz.newlyAddedQuiz)
        .map(newQuizzes => ({
            quizName: newQuizzes.name
            //, quizQuestions: [newQuizzes.questions].map(this.questionValues)
            , quizQuestions: this.questionValues([newQuizzes.questions])
        }))
        //.reduce((acc, quiz) => acc = quiz, {})
        ;

        // newQuizzes.quizQuestions = newQuizzes.quizQuestions.map(q => q.name);

        /*
        .reduce((quizzes, newQuizzes) => {

            //console.log([newQuizzes.questions[index]]);

            quizzes = { quizName: newQuizzes.name
                , quizQuestions: [newQuizzes.questions].map((q, index) => q[index].name) };


            return quizzes;
        }, {});
        */
/*
        
*/
        console.log(newQuizzes);

        //.join('');

        
        this.quizService.saveQuizzes(
            this.getEditedQuizzes()
            , newQuizzes
        )
        .subscribe(
            data => console.log(data),
            err => console.error(err)
        );
        
        
    
        
        const example: object =  {
                "changedQuizzes": this.getEditedQuizzes()
            ​
                // newQuizzes shape are the interesting bits for the slack-n-tell ! ! !
                , "newQuizzes": [
                    { 
                        "quizName": "Foo"
                        , "quizQuestions": [
                            "qOne"
                            , "qTwo"
                        ]
                    }
                    , {
                        "quizName": "Bar"
                        , "quizQuestions": [
                            "cat"
                            , "dog"
                        ]
                    }
                ]
            }
        
            console.log(example);



    }

    detailsAnimationState: string = "leftPosition";
    detailsAnimationComplete() {
        this.detailsAnimationState = "leftPosition";
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
        } catch (err) {
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
        } catch (err) {
            console.log(err);
        }


    }

}
