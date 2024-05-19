import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CognitoService } from '../../services/cognito.service';
import { AlertDialogComponent } from '../alert-component/alert-component.component';
import { UtilsService } from '../common/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { ViewUserOrdersComponent } from './view-user-orders/view-user-orders.component';

export interface UserElement {
  email_verified: boolean;
  phone_number: string;
  given_name: string;
  family_name: string;
  custom_role: string;
  email: string;
  UserCreateDate: Date;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'given_name',
    'family_name',
    'phone_number',
    'email',
    'email_verified',
    'custom_role',
    'UserCreateDate',
    'actions',
  ];

  dataSource = new MatTableDataSource<UserElement>([]);
  selection = new SelectionModel<UserElement>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cognitoService: CognitoService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.cognitoService.listAllUsers().then((users) => {
      const userElements = users.map((user) => ({
        email_verified:
          user.Attributes.find((attr) => attr.Name === 'email_verified')
            ?.Value === 'true',
        phone_number: user.Attributes.find(
          (attr) => attr.Name === 'phone_number'
        )?.Value,
        given_name: user.Attributes.find((attr) => attr.Name === 'given_name')
          ?.Value,
        family_name: user.Attributes.find((attr) => attr.Name === 'family_name')
          ?.Value,
        custom_role: user.Attributes.find((attr) => attr.Name === 'custom:role')
          ?.Value,
        email: user.Attributes.find((attr) => attr.Name === 'email')?.Value,
        UserCreateDate: new Date(user.UserCreateDate),
      }));
      this.dataSource.data = userElements;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  async deleteUser(user: UserElement) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete the user ${user.email}?`,
      },
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result.confirm) {
        try {
          await this.cognitoService.deleteUser(user.email);
          UtilsService.openSnackBar('User deleted successfully', this.snackBar, UtilsService.SnackbarStates.Success);
          this.fetchUsers();
        } catch (error) {
          UtilsService.openSnackBar('Error deleting user', this.snackBar, UtilsService.SnackbarStates.Error);
          console.error('Error deleting user:', error);
        }
      }
    });
  }

  async multipleDelete() {
    const selectedUsers = this.selection.selected;
    const usernames = selectedUsers.map((user) => user.email);
    if (selectedUsers.length == 0) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Error',
          hasCancel: false,
          message: 'Select at least one user to perform an action',
        },
      });
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Delete Multiple Users',
          message: `Are you sure you want to delete the following user(s)? <ul>${usernames}</ul>`,
        },
        width: '500px',
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result.confirm) {
          try {
            await this.cognitoService.deleteMultipleUsers(usernames);
            UtilsService.openSnackBar('User(s) deleted successfully', this.snackBar, UtilsService.SnackbarStates.Success);
            this.fetchUsers();
          } catch (error) {
            UtilsService.openSnackBar('Error deleting user(s)', this.snackBar, UtilsService.SnackbarStates.Error);
            console.error('Error deleting multiple users:', error);
          }
        }
      });
    }
  }

  openEditDialog(user: UserElement): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(user.email, result);
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addUser(result);
      }
    });
  }

  async updateUser(email: string, updatedUser: any): Promise<void> {
    try {
      await this.cognitoService.editUser(email, {
        email: updatedUser.email,
        given_name: updatedUser.given_name,
        family_name: updatedUser.family_name,
        phone_number: updatedUser.phone_number,
        'custom:role': updatedUser.custom_role,
      });
      UtilsService.openSnackBar('User updated successfully', this.snackBar, UtilsService.SnackbarStates.Success);
      this.fetchUsers();
    } catch (error) {
      UtilsService.openSnackBar('Error updating user', this.snackBar, UtilsService.SnackbarStates.Error);
      console.error('Error updating user:', error);
    }
  }

  async addUser(newUser: any): Promise<void> {
    try {
      await this.cognitoService.signUp({
        email: newUser.email,
        password: newUser.password,
        givenName: newUser.given_name,
        familyName: newUser.family_name,
        phoneNumber: newUser.phone_number,
        role: newUser.custom_role,
        code: '',
        showPassword: false
      });
      UtilsService.openSnackBar('User added successfully', this.snackBar, UtilsService.SnackbarStates.Success);
      this.fetchUsers();
    } catch (error) {
      UtilsService.openSnackBar('Error adding user', this.snackBar, UtilsService.SnackbarStates.Error);
      console.error('Error adding user:', error);
    }
  }

  viewUserOrders(user: UserElement): void {
    const dialogRef = this.dialog.open(ViewUserOrdersComponent, {
    width: '600px',
    height: '700px',
    data: { user }
    });
  }
}
