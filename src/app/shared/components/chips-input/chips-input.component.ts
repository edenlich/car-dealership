import { Component, Input } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormArray, FormBuilder } from '@angular/forms';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-chips-input',
  templateUrl: './chips-input.component.html',
  styleUrl: './chips-input.component.scss'
})
export class ChipsInputComponent {
  @Input() formArray!: FormArray;
  @Input() entityName!: string;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(private fb: FormBuilder) { }

  get placeholder() {
    return `${this.entityName}...`
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.formArray.push(this.fb.control(value));
    }
    event.chipInput!.clear();
  }

  remove(index: number): void {
    this.formArray.removeAt(index);
  }
}
