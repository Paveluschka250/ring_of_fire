import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
  export class GameInfoComponent implements OnChanges {
  cardAction = [
    { title: 'Ass – Waterfall', description: 'Alle beginnen gleichzeitig zu trinken; niemand darf aufhören, bevor die Person links aufhört.' },
    { title: 'Zwei – You', description: 'Bestimme eine Person, die trinken muss.' },
    { title: 'Drei – Me', description: 'Du selbst trinkst einen Schluck.' },
    { title: 'Vier – Floor', description: 'Alle müssen den Boden berühren; wer zuletzt dran ist, trinkt.' },
    { title: 'Fünf – Guys', description: 'Alle Männer trinken.' },
    { title: 'Sechs – Chicks', description: 'Alle Frauen trinken.' },
    { title: 'Sieben – Heaven', description: 'Alle zeigen Richtung Himmel; wer zuletzt reagiert, trinkt.' },
    { title: 'Acht – Mate', description: 'Wähle einen Trinkpartner; immer wenn du trinkst, muss die Person mittrinken.' },
    { title: 'Neun – Reim', description: 'Sage ein Wort; reihum muss ein Reim folgen. Wer keinen findet, trinkt.' },
    { title: 'Zehn – Kategorien', description: 'Wähle eine Kategorie; wer nichts Passendes mehr nennen kann, trinkt.' },
    { title: 'Bube – Regel', description: 'Erfinde eine neue Spielregel, die ab sofort gilt, bis ein neuer Bube gezogen wird.' },
    { title: 'Dame – Fragenmeister', description: 'Du bist Fragenmeister; wer auf deine Fragen antwortet, trinkt, bis eine neue Dame gezogen wird.' },
    { title: 'König – Kings Cup', description: 'Fülle einen Teil deines Getränks in den Becher. Wer den letzten König zieht, trinkt den gesamten Kings Cup.' }
  ];

  title = '';
  description = '';
  @Input() card: string = '';

  ngOnChanges(): void {
    if (this.card) {
      console.log(this.card);
      let cardNumber = +this.card.split('_')[1];
        this.title = this.cardAction[cardNumber - 1].title;
        this.description = this.cardAction[cardNumber - 1].description;
      }
  }
}
