import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class QuizService {

    constructor(private httpClient: HttpClient) { }

    loadQuizzesFromApi(): Promise <any> {
        
        return new Promise((resolve, reject) => {
            try {
                //setTimeout(() => {
                    resolve(this.httpClient.get('https://modern-js.azurewebsites.net/api/HttpTriggerJS1?code=8XD3vN3ehHLdZacBQJQhgUnNst9202gdd5VM3kWCytDkz2nXhia6kA==&name=Mystery%20Quiz'));
                //}, 500);
            } catch (error) {
                reject('New Error' + error);
            }
        });
        
    }

    loadQuizzes(): Promise <any> {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    resolve(
                        [
                            { 
                                name: 'Quiz 1', 
                                questionCount: 0, 
                                questions: [{name : 'question 1'}, {name : 'question 2'}, {name : 'question 3'}], 
                                markedForDelete: false
                            }
                            , { name: 'Quiz 2', questionCount: 0, questions: [], markedForDelete: false}
                            , { name: 'Quiz 3', questionCount: 0, questions: [{name : 'question 4'}], markedForDelete: false}
                        ]
                    );
                }, 1000);
            } catch (error) {
                reject('New Error' + error);
            }
        });
    }


    saveQuizzes(changedQuizzes: any[], newQuizzes: any[] = []) {

        const h = new HttpHeaders({
            'Content-Type': 'application/json'
            , 'X-Sas-Token': 'sig=K2WE6NQPtyoV6ke5hwPEaEaW52fgvyFWUeCEdPJls1s'
        });
    
        //console.log(h);

        console.log(JSON.stringify({
            "changedQuizzes": changedQuizzes
            , "newQuizzes": newQuizzes
        }));
        
        return this.httpClient.post(
            'https://modern-js.azurewebsites.net/save-quizzes-proxy'
            , JSON.stringify({
                "changedQuizzes": changedQuizzes
                , "newQuizzes": newQuizzes
            }
        )
        , {
            headers: h
        });
        
    }


    loadQuizzesOLD(tokken): Promise<any> {

        let quizzes: any = [];

        if(tokken) {
            quizzes =
                this.httpClient.get(
                    'https://modern-js.azurewebsites.net/api/HttpTriggerJS1?code=8XD3vN3ehHLdZacBQJQhgUnNst9202gdd5VM3kWCytDkz2nXhia6kA==&name=Mystery%20Quiz'
                )
            ;
        } else {
            quizzes =
                [
                    { 
                        name: 'Quiz 1', 
                        questionCount: 0, 
                        questions: [{name : 'question 1'}, {name : 'question 2'}, {name : 'question 3'}], 
                        markedForDelete: false
                    }
                    , { name: 'Quiz 2', questionCount: 0, questions: [], markedForDelete: false}
                    , { name: 'Quiz 3', questionCount: 0, questions: [{name : 'question 4'}], markedForDelete: false}
                ];
        }

        return new Promise<any>((resolve, reject) => {

            if (quizzes) {
                resolve(quizzes);
            } else {
                reject('No Quizzes Found');
            }

        });

    }


    getMagicNumberPromise(makeThisPromiseSucceed: boolean): Promise<number> {
        const p = new Promise<number>((resolve, reject) => makeThisPromiseSucceed ? resolve(42) : reject('Failed getMagicNumberPromise'));
        return p;
    }

}
