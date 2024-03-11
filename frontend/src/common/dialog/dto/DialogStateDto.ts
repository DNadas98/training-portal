export interface DialogStateDto {
  text: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => unknown;
  blockScreen?: boolean;
}
