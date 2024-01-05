import { Gender } from './gender.model';
import { MotorType } from './motor-type.model';
import { Location } from './location.model';

export interface QuizData {
    name: string;
    gender: Gender;
    email: string;
    birthdate: Date;
    location: Location;
    hobbies: string[];
    color: string;
    seats: number;
    motor: MotorType;
}