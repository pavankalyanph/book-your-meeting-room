import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) { }

  onSubmit() {
    if (this.username === 'user' && this.password === 'password') {
      sessionStorage.setItem('loggedInUser', this.username);
      this.router.navigate(['/main']);
    } else {
      alert('Invalid credentials');
    }
  }
}
