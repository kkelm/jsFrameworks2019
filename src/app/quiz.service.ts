import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class QuizService {

    constructor(private httpClient: HttpClient) { }

    loadQuizzes() {
        // Web Service
        // return this.httpClient.get('https://modern-js.azurewebsites.net/api/HttpTriggerJS1?code=8XD3vN3ehHLdZacBQJQhgUnNst9202gdd5VM3kWCytDkz2nXhia6kA==&name=Mystery%20Quiz');
        
        // Local Array
        return [
            { name: 'Quiz 1', questionCount: 0, questions: [{name : 'question 1'}, {name : 'question 2'}, {name : 'question 3'}]}
            , { name: 'Quiz 2', questionCount: 0, questions: []}
            , { name: 'Quiz 3', questionCount: 0, questions: [{name : 'question 4'}]}
        ];
    }

    getMagicNumberPromise(makeThisPromiseSucceed: boolean): Promise<number> {
        const p = new Promise<number>((resolve, reject) => makeThisPromiseSucceed ? resolve(42) : reject('Failed getMagicNumberPromise'));
        return p;
    }

}
