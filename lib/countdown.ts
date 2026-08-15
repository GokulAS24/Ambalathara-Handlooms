import type { CountdownSegment, TimeLeft } from '@/types';
import { pad } from '@/lib/utils';

const MS_SECOND = 1000;
const MS_MINUTE = MS_SECOND * 60;
const MS_HOUR = MS_MINUTE * 60;
const MS_DAY = MS_HOUR * 24;

export const ZERO_TIME: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  total: 0,
};

/**
 * Pure time math — no Date.now() inside, so it stays testable and
 * gives identical output for identical inputs.
 */
export function getTimeLeft(targetTimestamp: number, from: number): TimeLeft {
  const total = targetTimestamp - from;

  if (!Number.isFinite(total) || total <= 0) {
    return ZERO_TIME;
  }

  return {
    days: Math.floor(total / MS_DAY),
    hours: Math.floor((total % MS_DAY) / MS_HOUR),
    minutes: Math.floor((total % MS_HOUR) / MS_MINUTE),
    seconds: Math.floor((total % MS_MINUTE) / MS_SECOND),
    total,
  };
}

const UNIT_LABELS = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
} as const;

/** Shapes raw time into the four display cards, in order. */
export function toSegments(time: TimeLeft): CountdownSegment[] {
  return [
    { unit: 'days', label: UNIT_LABELS.days, value: time.days, display: pad(time.days, 2) },
    { unit: 'hours', label: UNIT_LABELS.hours, value: time.hours, display: pad(time.hours) },
    { unit: 'minutes', label: UNIT_LABELS.minutes, value: time.minutes, display: pad(time.minutes) },
    { unit: 'seconds', label: UNIT_LABELS.seconds, value: time.seconds, display: pad(time.seconds) },
  ];
}

/** Screen-reader friendly summary, e.g. "2 days, 4 hours, 9 minutes remaining". */
export function toAccessibleLabel(time: TimeLeft): string {
  if (time.total <= 0) return 'The store is now open.';
  return `${time.days} days, ${time.hours} hours, ${time.minutes} minutes and ${time.seconds} seconds until launch.`;
}
