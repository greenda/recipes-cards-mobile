import { schedule } from '../mock/schedule';

const IS_MOCK = true;

export class Fetcher {
  schedule: {
    id: number,
    from: string,
    to: string,
    meal: string,
    type: string,
    recipe_id?: number,
    description?: string,
  }[];

  getSchedule() {
    if (IS_MOCK) {
      if (!this.schedule) {
        this.schedule = schedule;
      }

      return this.schedule;
    }
  }

  addDay(entity) {
    if (IS_MOCK) {
      this.schedule = [...this.schedule, { id: this.schedule.length + 1, ...entity }];

      return { status: 'ok' };
    }
  }

  updateDay(entity) {
    this.schedule = [
      ...this.schedule.filter(({ id }) => id !== entity.id),
      entity,
    ];
  }

  removeDay(entityId) {
    if (IS_MOCK) {
      this.schedule = this.schedule.filter(({ id }) => id !== entityId);
    }
  }
}
