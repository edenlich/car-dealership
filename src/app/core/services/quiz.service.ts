import { Injectable } from '@angular/core';
import { QuizData } from '../models/quiz-data.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly quizzesKey = 'quizzes';

  constructor() { }

  saveQuizData(data: QuizData): Observable<QuizData>{
    let savedQuizzes = localStorage.getItem(this.quizzesKey);
    const quizzes = savedQuizzes ? JSON.parse(savedQuizzes) : [];
    quizzes.push(data);
    localStorage.setItem(this.quizzesKey, JSON.stringify(quizzes));
    return of(data);
  }

  getQuizzes(): QuizData[] {
    let savedQuizzes = localStorage.getItem(this.quizzesKey);
    return savedQuizzes ? JSON.parse(savedQuizzes) : [];
  }
}
