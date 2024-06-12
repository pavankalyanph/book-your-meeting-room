import { Component, OnInit } from '@angular/core';

export interface Meeting {
  userName: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  room: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  loggedInUser: string | null = null;
  upcomingMeetings: Meeting[] = [];
  meetingsByRoom: { [key: number]: Meeting[] } = {};
  showPopup: boolean = false;

  ngOnInit() {
    this.loadMeetings();
  }

  loadMeetings() {
    const meetings = JSON.parse(sessionStorage.getItem('meetings') || '[]');
    this.upcomingMeetings = meetings;
    this.organizeMeetingsByRoom();
  }

  organizeMeetingsByRoom() {
    this.meetingsByRoom = {};
    this.upcomingMeetings.forEach(meeting => {
      if (!this.meetingsByRoom[meeting.room]) {
        this.meetingsByRoom[meeting.room] = [];
      }
      this.meetingsByRoom[meeting.room].push(meeting);
    });
  }

  logout() {
    this.loggedInUser = null;
    // Any additional logout logic here
  }

  openBookingPopup() {
    this.showPopup = true;
  }

  closeBookingPopup() {
    this.showPopup = false;
    this.loadMeetings();
  }

  getRoomSlot() {
    return Object.keys(this.meetingsByRoom).map(Number);
  }

  deleteMeeting(index: number) {
    this.upcomingMeetings.splice(index, 1);
    sessionStorage.setItem('meetings', JSON.stringify(this.upcomingMeetings));
  }
}
