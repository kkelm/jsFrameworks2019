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
    }

    addQuestion(newQuestion) {
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
    }

    deleteQuestion(event) {

        const id: number = parseInt(event.currentTarget.getAttribute('data-id'));

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

}
