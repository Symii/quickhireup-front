import { ref } from 'vue';

const message = ref<string | null>(null);
const visible = ref(false);

function showMessage(msg: string, timeout = 3000) {
  message.value = msg;
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
    message.value = null;
  }, timeout);
}

export function useNotification() {
  return { message, visible, showMessage };
}
