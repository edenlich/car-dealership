import { Injectable } from '@angular/core';
import { Observable, filter, map, of } from 'rxjs';

import { QuizService } from './quiz.service';
import { QuizData } from '../models/quiz-data.model';
import { GraphData } from '../models/graph-data.model';
import { BreakdownGraphData } from '../models/breakdown-graph-data.model';
import { MotorTableData } from '../models/motor-table-type.model';
import { Gender } from '../models/gender.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private quizService: QuizService) { }

  getColorsGraphData(): Observable<BreakdownGraphData[]> {
    const quizzes = this.quizService.getQuizzes();

    return of(quizzes).pipe(
      filter((data: QuizData[]) => !!data.length),
      map((data) => data.map((d) => ({ ...d, age: this.getAge(d) }))),
      map((data) => this.mapByLabel(data, 'age')),
      map((map) => {
        const newMap: Record<string, GraphData> = {};
        Object.keys(map).forEach((age) => {
          const colors = map[age].map((data) => data.color);
          const colorMap = this.mapLabelsWithCount(colors);
          const colorLabels = Object.keys(colorMap);
          const amounts = Object.values(colorMap);
          newMap[age] = { labels: colorLabels, amounts };
        });
        return newMap;
      }),
      map((map) => {
        const ages = Object.keys(map);
        return ages.map((age) => ({ step: age, labels: map[age].labels, amounts: map[age].amounts }));
      })
    )
  }

  getHobbiesGraphData(): Observable<GraphData> {
    const quizzes = this.quizService.getQuizzes();

    return of(quizzes).pipe(
      filter((data: QuizData[]) => !!data.length),
      map((data: QuizData[]) => { return data.flatMap((d: QuizData) => d.hobbies) }),
      map((hobbies: string[]) => this.mapLabelsWithCount(hobbies)),
      map((map) => {
        const hobbies = Object.keys(map);
        const amounts = Object.values(map);
        return { labels: hobbies, amounts };
      })
    )
  }

  getCitiesGraphData(): Observable<GraphData> {
    const quizzes = this.quizService.getQuizzes();

    return of(quizzes).pipe(
      filter((data: QuizData[]) => !!data.length),
      map((data: QuizData[]) => { return data.map((d: QuizData) => d.location.city) }),
      map((cities: string[]) => this.mapLabelsWithCount(cities)),
      map((map) => {
        const cities = Object.keys(map);
        const amounts = Object.values(map);
        return { labels: cities, amounts };
      })
    );
  }

  getMotorTableData(): Observable<MotorTableData[]> {
    const quizzes = this.quizService.getQuizzes();

    return of(quizzes).pipe(
      filter((data: QuizData[]) => !!data.length),
      map((data) => {
        const map: Record<string, Omit<MotorTableData, 'gender'>> = {};
        data.forEach((d) => {
          const gender = d.gender;
          if (!map[gender]) {
            map[gender] = { electric: 0, fuel: 0 };
          }
          const motorType = d.motor;
          map[gender][motorType] += 1;
        });
        return map;
      }),
      map((map) => {
        const percentageMap: Record<string, Omit<MotorTableData, 'gender'>> = {};
        Object.keys(map).forEach((gender) => {
          const electricCount = map[gender].electric;
          const fuelCount = map[gender].fuel;
          const totalCount = electricCount + fuelCount;
          percentageMap[gender] = { electric: electricCount / totalCount, fuel: fuelCount / totalCount };
        });
        return percentageMap;
      }),
      map((map) => {
        return Object.keys(map).map((gender) =>
          ({ gender: gender as Gender, electric: map[gender].electric, fuel: map[gender].fuel })
        );
      }),
    );
  }

  private mapLabelsWithCount(labels: string[]) {
    const map: Record<string, number> = {};
    labels.forEach((l) => {
      if (!map[l]) {
        map[l] = 1;
      } else {
        map[l] += 1;
      }
    });
    return map;
  }

  private mapByLabel(data: Array<QuizData & Record<string, any>>, label: string) {
    const map: Record<string, QuizData[]> = {};
    data.forEach((d) => {
      const { [label]: RemovedLabel, ...oldData } = d;
      if (!map[RemovedLabel]) {
        map[RemovedLabel] = [oldData as QuizData]
      } else {
        map[RemovedLabel].push(oldData as QuizData);
      }
    });
    return map;
  }

  private getAge(quizData: QuizData) {
    var today: Date = new Date();
    var birthDate: Date = new Date(quizData.birthdate);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
