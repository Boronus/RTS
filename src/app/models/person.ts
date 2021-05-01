export interface Person {
  age: number;
  name: {
    first: string,
    last: string,
  };
  id?: number; // Идентификатор элемента на фронте. Позволяет нам находить нужный элемент. Просто по индексу это сделать сложнее из-за того как реализована сортировка в mat-table
  email?: string;
  guid?: string;
  fullName?: string;
  short?: string;
}
