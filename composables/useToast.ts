export const useToast = () => {
  const toastMsg = useState<string | null>('toastMsg', () => null);

  const showToast = (message: string) => {
    toastMsg.value = message;
    setTimeout(() => {
      toastMsg.value = null;
    }, 4000);
  };

  return {
    toastMsg,
    showToast,
  };
};
