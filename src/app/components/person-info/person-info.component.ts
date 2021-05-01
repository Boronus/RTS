import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Person } from '../../models/person';
import { toTitleCase } from 'codelyzer/util/utils';

const INTERNATIONAL_NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ ,.'-]+$/u;

@Component({
  selector: 'app-person-info',
  templateUrl: './person-info.component.html',
  styleUrls: ['./person-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonInfoComponent implements OnChanges {
  @Input() selectedPerson: Person;
  @Output() personChanged: EventEmitter<Person> = new EventEmitter<Person>();

  personFormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern(INTERNATIONAL_NAME_REGEX)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(INTERNATIONAL_NAME_REGEX)]),
    age: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.min(0), Validators.max(200)]),
  });

  ngOnChanges(): void {
    if (!this.selectedPerson) {
      this.personFormGroup.reset();
      return;
    }

    this.personFormGroup.reset({
      firstName: this.selectedPerson.name.first,
      lastName: this.selectedPerson.name.last,
      age: this.selectedPerson.age,
    });
  }

  isControlInvalid(formControlName: string): boolean {
    return this.personFormGroup.get(formControlName).invalid;
  }

  getTextErrorMessage(formControlName: string): string {
    const errors = this.personFormGroup.get(formControlName).errors;

    if (errors.pattern) {
      return 'Field is incorrect';
    }

    if (errors.required) {
      return 'Field is required';
    }

    return '';
  }

  getNumberErrorMessage(): string {
    const errors = this.personFormGroup.get('age').errors;

    if (errors.required) {
      return 'Field is required';
    }

    if (errors.min) {
      return 'Age should be more than ' + errors.min.min;
    }

    if (errors.max) {
      return 'Age should be less than ' + errors.max.max;
    }

    if (errors.pattern) {
      return 'Only positive integers';
    }

    return '';
  }

  save(): void {
    const previousValues = this.selectedPerson || {};

    const newValues = {
      name: {
        first: toTitleCase(this.personFormGroup.value.firstName),
        last: toTitleCase(this.personFormGroup.value.lastName),
      },
      age: this.personFormGroup.value.age,
    };

    this.personChanged.emit(
      Object.assign(previousValues, newValues)
    );

    this.personFormGroup.reset();
  }
}
