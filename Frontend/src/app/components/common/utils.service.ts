import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
  })
  
export class UtilsService {
    static snackBar: MatSnackBar;
    static SnackbarStates = { 
        Success: "success",
        Error: "error",
    }

    constructor() { }

    static openSnackBar(message: string, snackBar: MatSnackBar, status: string){
        snackBar.open(
          message, 
          '', 
          {
          duration: 4000,
          verticalPosition: 'bottom',
          panelClass: status == this.SnackbarStates.Success ? 'app-notification-success' : 'app-notification-error'
          }
          );
    }

}