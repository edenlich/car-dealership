import { Injectable } from '@angular/core';
import { QuizData } from '../models/quiz-data.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  // quizzes$ - all the answered quizzes
  private readonly quizzesKey = 'quizzes';

  constructor() { }

  saveQuizData(data: QuizData): Observable<QuizData>{
    // localStorage.clear();
    // localStorage.setItem('ship', JSON.stringify([{ name: '1', size: 5 }, { name: '2', size: 2 }]));
    // const b = JSON.parse(localStorage.getItem('ship') || '');
    // b.push({ name: '3', size: 10 })
    // localStorage.setItem('ship', JSON.stringify(b));
    // console.log('aaaa', JSON.parse(localStorage.getItem('ship') || ''));


    let savedQuizzes = localStorage.getItem(this.quizzesKey);
    const quizzes = savedQuizzes ? JSON.parse(savedQuizzes) : [];
    quizzes.push(data);
    localStorage.setItem(this.quizzesKey, JSON.stringify(quizzes));
    return of(data);
  }
}
