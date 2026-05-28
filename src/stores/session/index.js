import { defineStore } from 'pinia';

// 30 minutes
const SESSION_LIFETIME_MS = 30 * 60 * 1000;

const KEEP_ALIVE_INTERVAL_MS = 1 * 60 * 1000;

const getLocalSession = () => {
  const localSession = localStorage.getItem('session');

  if (!localSession) {
    return null;
  }

  let session = null;

  try {
    session = JSON.parse(localSession);
  } catch (error) {
    return null;
  }

  if (!session || typeof session !== 'object') {
    return null;
  }

  if ((!session.updatedAt || new Date(session.updatedAt) <= new Date(Date.now() - SESSION_LIFETIME_MS))) {
    return null;
  }

  return session;
};

let session = getLocalSession();

if (session) {
  session.updatedAt = new Date();
} else {
  session = {
    updatedAt: new Date(),
    id: crypto.randomUUID(),
  };
}

localStorage.setItem('session', JSON.stringify(session));

setInterval(() => {
  const localSession = getLocalSession();

  if (!localSession) {
    return;
  }

  localSession.updatedAt = new Date();
  localStorage.setItem('session', JSON.stringify(localSession));
}, KEEP_ALIVE_INTERVAL_MS);

export default defineStore('session', {
  state: () => ({
    session: session,
  }),

});
