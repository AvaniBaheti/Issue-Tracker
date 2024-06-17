import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const notifySuccess = (message: string) => {
  toast.success(message, toastConfig);
};

export const notifyError = (message: string) => {
  toast.error(message, toastConfig);
};
