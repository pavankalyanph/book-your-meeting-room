import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedInUser: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loggedInUser = sessionStorage.getItem('loggedInUser');
  }

  logout() {
    sessionStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
