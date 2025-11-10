export interface Observer {
  update(eventType: string, payload: any): Promise<void> | void;
}