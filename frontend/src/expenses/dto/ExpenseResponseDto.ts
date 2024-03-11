export interface ExpenseResponseDto {
  readonly expenseId: number;
  readonly name: string;
  readonly price: number;
  readonly paid: boolean;
}
