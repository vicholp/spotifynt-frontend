import eventsApi from '../api/events';
import {
  StoredEvent,
} from '../schemas/events';
import useSessionStore from '../stores/session';
import useUserStore from '../stores/user';

const batcher = {
  events: [],
  add(event) {
    this.events.push(event);
  },
  flush() {
    const events = this.events;
    this.events = [];
    return events;
  },
};

setInterval(() => {
  const events = batcher.flush();
  if (events.length > 0) {
    eventsApi.storeEvents(events).catch(error => {
      console.error('Error storing events:', error);
      events.forEach(event => batcher.add(event));
    });
  }
}, 10000);

export function useEvents() {
  const sessionStore = useSessionStore();
  const userStore = useUserStore();

  async function storeEvent(event) {
    const parsedEvent = StoredEvent.safeParse({
      ...event,
      sessionId: sessionStore.session?.id,
      userId: userStore.user?.id,
      createdAt: new Date().toISOString(),
    });

    if (!parsedEvent.success) {
      console.error('Invalid event:', parsedEvent.error);
      return;
    }

    batcher.add(parsedEvent.data);
  }


  return {
    storeEvent,
  };
}
