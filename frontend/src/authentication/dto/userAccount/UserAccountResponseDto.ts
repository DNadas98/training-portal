import {AccountType} from "./AccountType.ts";

export interface UserAccountResponseDto {
    readonly id: number,
    readonly email: string,
    readonly accountType: AccountType
}
