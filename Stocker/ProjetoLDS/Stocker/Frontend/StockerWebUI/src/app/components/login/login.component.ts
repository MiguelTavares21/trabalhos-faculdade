import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // The reactive form group for login
  loginForm!: FormGroup;

  // Array to manage alert messages displayed to the user
  alerts: string[] = [];

  // Controls visibility of the password field
  passwordVisible: boolean = false;

  constructor(
    private authService: AuthService, // Service to handle authentication
    private userService: UserService, // Service to interact with user data
    private router: Router // Router to navigate between pages
  ) {}

  ngOnInit(): void {
    // Initialize the login form with email and password controls
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required, // Email is required
        Validators.email, // Must be a valid email format
      ]),
      password: new FormControl('', [
        Validators.required, // Password is required
      ]),
    });
  }

  // Getter method for the email form control
  getEmail() {
    return this.loginForm.get('email');
  }

  // Getter method for the password form control
  getPassword() {
    return this.loginForm.get('password');
  }

  // Triggered when the login form is submitted
  onLogin() {
    // Ensure the form is valid before proceeding
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value; // Extract email and password
      this.authService.login(credentials).subscribe({
        // Handle successful login
        next: (response) => {
          this.authService.setToken(response.token); // Store the authentication token
          this.router.navigate(['/home']); // Navigate to the home page
        },
        // Handle login errors
        error: (error) => {
          console.error(error); // Log the error for debugging
          this.addAlert(
            'Login failed. Please check your information and try again!'
          );
        },
      });
    }
  }

  // Adds an alert message to the alerts array
  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
  }

  // Removes an alert message from the alerts array
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }

  // Toggles the visibility of the password input field
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Flip visibility state
    const passwordField: any = document.getElementById('password'); // Get password input field
    passwordField.type = this.passwordVisible ? 'text' : 'password'; // Toggle type attribute
  }
}
