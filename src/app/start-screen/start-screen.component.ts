import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  starting = false;

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  }

  startGame() {
    if (this.starting) return;
    this.starting = true;
    const game = new Game();
    this.firestore
      .collection('games')
      .add(game.toJson())
      .then((gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      })
      .catch((err) => {
        this.starting = false;
        console.error('Fehler beim Erstellen des Spiels:', err);
        this.snackBar.open(
          'Spiel konnte nicht gestartet werden. Bitte prüfe die Verbindung und lade die Seite neu.',
          'OK',
          { duration: 8000 }
        );
      });
  }
}
