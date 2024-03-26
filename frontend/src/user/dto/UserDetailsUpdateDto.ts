export interface UserDetailsUpdateDto {
  readonly username: string,
  readonly oldPassword: string,
  newPassword?: string | undefined
}
