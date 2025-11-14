import { Subject } from './Subject';
import { Observer } from './Observer';

export class NotificationManager implements Subject {
  private observers: Observer[] = [];

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  async notify(eventType: string, payload: any): Promise<void> {
    for (const observer of this.observers) {
      await observer.update(eventType, payload);
    }
  }
}