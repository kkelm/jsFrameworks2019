import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  constructor(private httpClient: HttpClient) { }

  loadQuizzes() {
      //return this.httpClient.get('https://modern-js.azurewebsites.net/api/HttpTriggerJS1?code=8XD3vN3ehHLdZacBQJQhgUnNst9202gdd5VM3kWCytDkz2nXhia6kA==&name=Mystery%20Quiz');
      
      return [
        { name: 'Quiz 1', questionCount: 0, questions: [{name : 'question 1'}, {name : 'question 2'}, {name : 'question 3'}]}
        , { name: 'Quiz 2', questionCount: 0, questions: []}
        , { name: 'Quiz 3', questionCount: 0, questions: [{name : 'question 4'}]}
      ];
      
  }

}