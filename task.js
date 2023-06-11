export class Task {
  static indexCounter = 0;

  constructor(newTask, name, index) {
    this.name = name;
    if (newTask) {
      this.index = ++Task.indexCounter;
    } else {
      this.index = index;
    }
  }

  print() {
    console.log(`Task : ${this.name}, Index : ${this.index}`);
  }

  setIndexCounter(index) {
    Task.indexCounter = index;
  }
}