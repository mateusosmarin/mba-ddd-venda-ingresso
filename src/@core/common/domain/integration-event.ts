export interface IntegrationEvent<T> {
  event_name: string;
  event_version: number;
  occurred_on: Date;
  payload: T;
}
