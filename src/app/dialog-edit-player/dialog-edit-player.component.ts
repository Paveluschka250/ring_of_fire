import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface EditPlayerResult {
  action: 'save' | 'delete';
  name?: string;
}

@Component({
  selector: 'app-dialog-edit-player',
  templateUrl: './dialog-edit-player.component.html',
  styleUrls: ['./dialog-edit-player.component.scss'],
})
export class DialogEditPlayerComponent {
  playerName: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogEditPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {
    this.playerName = data.name;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.playerName.trim().length > 0) {
      this.dialogRef.close({ action: 'save', name: this.playerName.trim() } as EditPlayerResult);
    }
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete' } as EditPlayerResult);
  }
}
