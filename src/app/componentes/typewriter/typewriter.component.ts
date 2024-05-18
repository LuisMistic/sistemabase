import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typewriter',
  templateUrl: './typewriter.component.html',
  styleUrls: ['./typewriter.component.css']
})
export class TypewriterComponent implements OnInit {
  typedText: string = '';

  constructor() { }

  ngOnInit(): void {
    this.typeText('SISTEMABASE');
  }

  typeText(text: string): void {
    let index = 0;
    const interval = setInterval(() => {
      this.typedText = text.slice(0, index + 1);
      index++;
      if (index === text.length) {
        clearInterval(interval);
      }
    }, 200); // Velocidad de escritura (en milisegundos)
  }
}
