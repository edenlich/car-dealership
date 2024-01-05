import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DateValidator } from '../../../core/validators/date-validator.validator';
import { QuizService } from '../../../core/services/quiz.service';
import { QuizData } from '../../../core/models/quiz-data.model';
import { Gender } from '../../../core/models/gender.model';
import { MotorType } from '../../../core/models/motor-type.model';
import { SnackBarComponent } from '../../components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  BuyerDetailsForm = this.fb.group({
    name: ['', Validators.required],
    gender: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthdate: ['', Validators.required],
    location: this.fb.group({
      city: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
    }),
    hobbies: this.fb.array([], Validators.required),
    color: ['#00897B', Validators.required],
    seats: [''],
    motor: ['', Validators.required],
  });

  readonly durationInSeconds = 5;

  constructor(private fb: FormBuilder, private quizService: QuizService, private _snackBar: MatSnackBar) {
  }

  get name() {
    return this.BuyerDetailsForm.get('name');
  }

  get gender() {
    return this.BuyerDetailsForm.get('gender');
  }

  get email() {
    return this.BuyerDetailsForm.get('email');
  }

  get birthdate() {
    return this.BuyerDetailsForm.get('birthdate');
  }

  get city() {
    return this.BuyerDetailsForm.get('location')?.get('city');
  }

  get country() {
    return this.BuyerDetailsForm.get('location')?.get('country');
  }

  get address() {
    return this.BuyerDetailsForm.get('location')?.get('address');
  }

  get hobbies() {
    return this.BuyerDetailsForm.get('hobbies') as FormArray;
  }

  get color() {
    return this.BuyerDetailsForm.get('color');
  }

  get seats() {
    return this.BuyerDetailsForm.get('seats');
  }

  get motor() {
    return this.BuyerDetailsForm.get('motor');
  }

  onSubmit() {
    const quizData: QuizData = this.createQuizData();
    this.quizService.saveQuizData(quizData).subscribe((d) => {
      this.openSnackBar();
    });
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  createQuizData(): QuizData {
    return {
      name: this.name?.value as string,
      gender: this.gender?.value as Gender,
      email: this.email?.value as string,
      birthdate: new Date(this.birthdate?.value as string),
      location: {
        city: this.city?.value as string,
        country: this.country?.value as string,
        address: this.address?.value as string,
      },
      hobbies: this.hobbies.value,
      color: this.color?.value as string,
      seats: Number(this.seats?.value),
      motor: this.motor?.value as MotorType,
    };
  }
}
