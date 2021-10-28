type TName = {
  first: string;
  last: string;
  middle?: string;
}
type TBirthDate = string | null;

export interface IPerson {
  name: TName;
  birthDate: TBirthDate;
}
