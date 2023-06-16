import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  isLoading = false;
  fileUrl: any;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.users = await this.userService.getUsers();
    this.isLoading = false;
  }

  async onEnabledChange(newValue: boolean, userId: string) {
    await this.userService.setEnable(newValue, userId);
  }

  downloadUsersExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = window.URL.createObjectURL(excelBlob);
    window.open(url);
  }
}
