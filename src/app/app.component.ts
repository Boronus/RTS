import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';

import jsonData from './assets/mates.json';
import { Person } from './models/person';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('drawer') drawer: MatDrawer;

  peopleArray: Person[];
  displayedColumns: string[] = ['avatar', 'age', 'email', 'fullName', 'short', 'actions'];
  dataSource: MatTableDataSource<any>;
  selectedPerson: Person;

  constructor() {
    this.peopleArray = jsonData
      .map(
        (person: Person, index: number) => {
          return this.recalculatePerson(person, index);
        }
      );

    this.dataSource = new MatTableDataSource(this.peopleArray);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  recalculatePerson(person: Person, id?: number): Person {
    person.fullName = `${person.name.first} ${person.name.last}`;
    person.short = `${person.name.first[0]}. ${person.name.last[0]}. ${person.email || ''}`;

    if (!person.id) {
      person.id = id;
    }

    return person;
  }

  onEdit(element: Person = null): void {
    this.selectedPerson = element;
    this.drawer.open();
  }

  onDelete(element: Person): void {
    this.dataSource.data = this.dataSource.data
      .filter(
        person => person.id !== element.id
      );
  }

  onPersonChanged(person: Person): void {
    this.drawer.close();

    // При необходимости изменить данные в this.dataSource.data, предварительно сохраняем их в константу из-за особенностей mat-table
    if (!person.id) {
      const newPerson = this.recalculatePerson(person, this.dataSource.data.length + 1);
      const data = this.dataSource.data;
      data.push(newPerson);
      this.dataSource.data = data;
    } else {
      const newPerson = this.recalculatePerson(person);
      const data = this.dataSource.data;
      const index = data.findIndex(tablePerson => tablePerson.id === person.id);
      data[index] = person;
      this.dataSource.data = data;
    }
  }
}
