import { z } from 'zod'

export const ShowedSource = z.enum(['queue', 'recommendations', 'search'])

export const AddedToQueueSource = z.enum(['recommendations', 'search'])

export const RecordingAddedToQueueGroup = z.enum(['by_recording', 'by_release', 'by_artist']);

export const EventType = z.enum([
  'recording_play_started',
  'recording_played',
  'recording_skipped',
  'recording_skipped_backward',
  'recording_showed',
  'recording_added_to_queue',
  'recording_removed_from_queue',
  'release_added_to_queue',
  'release_showed',
  'artist_showed',
  'queue_cleared',
  'queue_shuffled',
  'search_performed',
])

const BaseEvent = z.object({});

export const RecordingPlayStartedEvent = BaseEvent.extend({
  eventType: z.literal('recording_play_started').default('recording_play_started'),
  payload: z.object({ recordingId: z.number().int() }),
})

export const RecordingPlayedEvent = BaseEvent.extend({
  eventType: z.literal('recording_played').default('recording_played'),
  payload: z.object({ recordingId: z.number().int(), playDuration: z.number().int() }),
})

export const RecordingSkippedEvent = BaseEvent.extend({
  eventType: z.literal('recording_skipped').default('recording_skipped'),
  payload: z.object({ recordingId: z.number().int(), playDuration: z.number().int() }),
})

export const RecordingSkippedBackwardEvent = BaseEvent.extend({
  eventType: z.literal('recording_skipped_backward').default('recording_skipped_backward'),
  payload: z.object({ recordingId: z.number().int(), playDuration: z.number().int() }),
})

export const RecordingShowedEvent = BaseEvent.extend({
  eventType: z.literal('recording_showed').default('recording_showed'),
  payload: z.object({ recordingId: z.number().int(), source: ShowedSource }),
})

export const RecordingAddedToQueueEvent = BaseEvent.extend({
  eventType: z.literal('recording_added_to_queue').default('recording_added_to_queue'),
  payload: z.object({ recordingId: z.number().int(), source: AddedToQueueSource, group: RecordingAddedToQueueGroup }),
})

export const RecordingRemovedFromQueueEvent = BaseEvent.extend({
  eventType: z.literal('recording_removed_from_queue').default('recording_removed_from_queue'),
  payload: z.object({ recordingId: z.number().int() }),
})

export const ReleaseAddedToQueueEvent = BaseEvent.extend({
  eventType: z.literal('release_added_to_queue').default('release_added_to_queue'),
  payload: z.object({ releaseId: z.number().int(), source: AddedToQueueSource }),
})

export const ReleaseShowedEvent = BaseEvent.extend({
  eventType: z.literal('release_showed').default('release_showed'),
  payload: z.object({ releaseId: z.number().int(), source: ShowedSource }),
})

export const ArtistShowedEvent = BaseEvent.extend({
  eventType: z.literal('artist_showed').default('artist_showed'),
  payload: z.object({ artistId: z.number().int(), source: ShowedSource }),
})

export const QueueClearedEvent = BaseEvent.extend({
  eventType: z.literal('queue_cleared').default('queue_cleared'),
  payload: z.object({}),
})

export const QueueShuffledEvent = BaseEvent.extend({
  eventType: z.literal('queue_shuffled').default('queue_shuffled'),
  payload: z.object({}),
})

export const SearchPerformedEvent = BaseEvent.extend({
  eventType: z.literal('search_performed').default('search_performed'),
  payload: z.object({ query: z.string() }),
})

export const Event = z.discriminatedUnion('eventType', [
  RecordingPlayStartedEvent,
  RecordingPlayedEvent,
  RecordingSkippedEvent,
  RecordingSkippedBackwardEvent,
  RecordingShowedEvent,
  RecordingAddedToQueueEvent,
  RecordingRemovedFromQueueEvent,
  ReleaseAddedToQueueEvent,
  ReleaseShowedEvent,
  ArtistShowedEvent,
  QueueClearedEvent,
  QueueShuffledEvent,
  SearchPerformedEvent,
]);

const EventContext = z.object({
  createdAt: z.iso.datetime(),
  userId: z.number().int(),
  sessionId: z.string(),
});

export const StoredEvent = z.intersection(Event, EventContext);
