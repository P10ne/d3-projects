type TName = {
  first: string;
  last: string;
  middle?: string;
}
type TBirthDate = string;

export interface IPerson {
  name: TName;
  birthDate: TBirthDate;
}
