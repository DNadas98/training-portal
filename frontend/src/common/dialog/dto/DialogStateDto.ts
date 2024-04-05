import {ReactNode} from "react";

export interface DialogStateDto {
  content: string|ReactNode;
  confirmText?: string;
  cancelText?: string;
  oneActionOnly?:boolean;
  onConfirm: () => unknown;
  blockScreen?: boolean;
}
