import { ref } from 'vue';

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  timeout: number;
}

const notifications = ref<Notification[]>([]);

export function useNotification() {
  function showMessage(msg: string, type: NotificationType = 'success', timeout = 4000) {
    const id = Date.now();
    notifications.value.push({ id, message: msg, type, timeout });

    setTimeout(() => {
      removeNotification(id);
    }, timeout);
  }

  function removeNotification(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  }

  return { notifications, showMessage, removeNotification };
}
