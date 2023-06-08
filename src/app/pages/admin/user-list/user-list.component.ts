import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  isLoading = false;

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

}
