import 'regenerator-runtime/runtime';

class Clicker {
  constructor(clickerId, clickInfoId) {
    this.counter = 0;
    this.clicker = document.getElementById(clickerId);
    this.clickInfo = document.getElementById(clickInfoId);
  }

  increase() {
    this.counter += 1;
  }

  print() {
    this.clickInfo.innerText = `You have clicked ${this.counter} times.`;
  }

  watch() {
    if (!this.clicker || !this.clickInfo) return;

    this.clicker.addEventListener('click', e => {
      this.increase();
      this.print();
    });
  }
}

class App {
  static async init() {
    try {
      const clicker = new Clicker('clicker', 'click-info');
      clicker.watch();

      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.register('/sw.js');
      }
    } catch (e) {
      console.log(e);
    }
  }
}

App.init();
