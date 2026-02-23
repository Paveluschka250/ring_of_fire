import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  DialogEditPlayerComponent,
  EditPlayerResult,
} from '../dialog-edit-player/dialog-edit-player.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game: Game = new Game();
  gameId: string = '';

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      this.gameId = params['id'];
      this.firestore
        .collection('games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((game: any) => {
          if (game) {
            this.game.currentPlayer = game.currentPlayer;
            this.game.playedCards = game.playedCards;
            this.game.stack = game.stack;
            this.game.players = game.players;
            this.game.pickCardAnimation = game.pickCardAnimation;
            this.game.currentCard = game.currentCard;
          }
        });
    });
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game.players.length < 2) {
      this.snackBar.open('Bitte füge mindestens zwei Spieler hinzu.', 'OK', {
        duration: 2500,
      });
      return;
    }

    if (this.game.stack.length === 0) {
      return;
    }

    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() as string;
      this.game.pickCardAnimation = true;
      this.game.currentPlayer =
        (this.game.currentPlayer + 1) % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1250);
    }
  }

  openDialog(): void {
    const config: MatDialogConfig = {
      autoFocus: true,
      restoreFocus: true,
    };
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, config);

    dialogRef.afterClosed().subscribe((playerName: string) => {
      if (playerName && playerName.length > 0) {
        this.game.players.push(playerName);
        this.saveGame();
      }
    });
  }

  openEditDialog(index: number): void {
    const config: MatDialogConfig = {
      data: { name: this.game.players[index] },
      autoFocus: true,
      restoreFocus: true,
    };
    const dialogRef = this.dialog.open(DialogEditPlayerComponent, config);

    dialogRef.afterClosed().subscribe((result: EditPlayerResult | undefined) => {
      if (!result) return;
      if (result.action === 'save' && result.name) {
        this.game.players[index] = result.name;
        this.saveGame();
      } else if (result.action === 'delete') {
        this.game.players.splice(index, 1);
        if (index < this.game.currentPlayer) {
          this.game.currentPlayer--;
        } else if (index === this.game.currentPlayer && this.game.currentPlayer >= this.game.players.length) {
          this.game.currentPlayer = 0;
        }
        if (this.game.currentPlayer >= this.game.players.length) {
          this.game.currentPlayer = 0;
        }
        this.saveGame();
      }
    });
  }

  dropPlayer(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.game.players, event.previousIndex, event.currentIndex);
    const previousCurrent = event.previousIndex;
    const newCurrent = event.currentIndex;
    if (this.game.currentPlayer === previousCurrent) {
      this.game.currentPlayer = newCurrent;
    } else if (
      previousCurrent < this.game.currentPlayer &&
      newCurrent >= this.game.currentPlayer
    ) {
      this.game.currentPlayer--;
    } else if (
      previousCurrent > this.game.currentPlayer &&
      newCurrent <= this.game.currentPlayer
    ) {
      this.game.currentPlayer++;
    }
    this.saveGame();
  }

  saveGame() {
    this.firestore
      .collection('games')
      .doc(this.gameId)
      .update(this.game.toJson());
  }
}
