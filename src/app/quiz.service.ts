import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor() { }

  loadQuizzes() {
      return [
        { name: 'Quiz 1', questionCount: 10, questions: []}
        , { name: 'Quiz 2', questionCount: 0, questions: []}
        , { name: 'Quiz 3', questionCount: 7, questions: []}
      ];
  }

}
