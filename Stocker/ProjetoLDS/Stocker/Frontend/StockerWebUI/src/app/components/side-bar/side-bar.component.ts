import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  /**
   * The email of the logged-in user.
   */
  userEmail!: String;

  /**
   * The name of the logged-in user.
   */
  userName!: String;

  /**
   * The complete user object.
   */
  user!: User;

  /**
   * A flag indicating if the user data is still being loaded.
   */
  loading = true;

  /**
   * The constructor injects the necessary services.
   * @param authService - The authentication service to manage user login state.
   * @param userService - The service to fetch and update user details.
   * @param router - The Angular router to navigate between views.
   */
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that runs when the component is initialized.
   * Retrieves user data by calling the user service and updating local state.
   */
  ngOnInit(): void {
    var id = this.authService.getUserId(); // Fetches the user ID from the auth service.
    if (id) {
      var userId = parseInt(id, 10); // Converts the string userId to a number.
      var user = this.userService
        .getUserById(userId) // Retrieves the user by ID.
        .subscribe((user: User) => {
          this.user = user; // Stores the user data.
          this.userEmail = user.email; // Stores the user's email.
          this.userName = user.name; // Stores the user's name.
          this.loading = false; // Marks data loading as complete.
        });
    }
  }

  /**
   * Toggles the notification preference for the user.
   * Sends the updated user data to the user service to save the changes.
   */
  toggleNotifications() {
    this.user.notifications = !this.user.notifications; // Toggle the notifications flag.
    this.userService.editAccount(this.user).subscribe((user: User) => {
      this.user = user; // Updates the user with the saved preferences.
    });
  }

  /**
   * Logs out the current user by calling the auth service and navigates to the login page.
   */
  logout() {
    this.authService.logout(); // Logs out the user.
    this.router.navigate(['/login']); // Navigates to the login page.
  }
}
