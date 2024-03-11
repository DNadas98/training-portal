export interface ExpenseAddUpdateRequestDto {
  readonly name: string;
  readonly price: number;
  readonly paid: boolean;
}
