export class BaseTimeBlock {
  id: number = null;
  text: string = '';
  start: Date = new Date();
  end: Date = new Date();
  tags: string[];
}
