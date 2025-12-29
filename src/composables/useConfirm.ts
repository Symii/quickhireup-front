import { reactive, readonly } from 'vue';

const state = reactive({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Tak, potwierdzam',
  cancelText: 'Anuluj',
  resolve: null as ((value: boolean) => void) | null,
});

export const useConfirm = () => {
  const confirm = (
    title: string,
    message: string,
    options = { confirmText: 'Tak', cancelText: 'Anuluj' },
  ): Promise<boolean> => {
    state.title = title;
    state.message = message;
    state.confirmText = options.confirmText;
    state.cancelText = options.cancelText;
    state.isOpen = true;

    return new Promise((resolve) => {
      state.resolve = resolve;
    });
  };

  const handleConfirm = () => {
    if (state.resolve) state.resolve(true);
    close();
  };

  const handleCancel = () => {
    if (state.resolve) state.resolve(false);
    close();
  };

  const close = () => {
    state.isOpen = false;
    state.resolve = null;
  };

  return {
    state: readonly(state),
    confirm,
    handleConfirm,
    handleCancel,
  };
};
