import { toast as toastifyToast } from "react-toastify";

const toast = {
  success: (msg: string) => toastifyToast.success(msg),
  error: (msg: string) => toastifyToast.error(msg),
  info: (msg: string) => toastifyToast.info(msg),
  warning: (msg: string) => toastifyToast.warning(msg),
  default: (msg: string) => toastifyToast(msg),
};

export default toast;
