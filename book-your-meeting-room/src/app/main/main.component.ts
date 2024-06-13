import { Component, OnInit } from '@angular/core';

export interface Meeting {
  username: string;
  agenda: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  upcomingMeetings: Meeting[] = [];
  meetingsByRoom: { [key: string]: Meeting[] } = {};
  filteredRooms: string[] = [];
  showPopup: boolean = false;

  ngOnInit() {
    this.loadMeetings();
  }

  loadMeetings() {
    const meetings = JSON.parse(sessionStorage.getItem('meetings') || '[]');
    this.upcomingMeetings = meetings;
    this.organizeMeetingsByRoom();
    this.filteredRooms = this.getRoomSlot();
  }

  organizeMeetingsByRoom() {
    this.meetingsByRoom = {};
    this.upcomingMeetings.forEach(meeting => {
      if (!this.meetingsByRoom[meeting.roomNumber]) {
        this.meetingsByRoom[meeting.roomNumber] = [];
      }
      this.meetingsByRoom[meeting.roomNumber].push(meeting);
    });
  }

  openBookingPopup() {
    this.showPopup = true;
  }

  closeBookingPopup() {
    this.showPopup = false;
    this.loadMeetings();
  }

  getRoomSlot() {
    return Object.keys(this.meetingsByRoom).sort((a, b) => Number(a.split(' ')[1]) - Number(b.split(' ')[1]));
  }

  filterMeetingsByRoom(event: any) {
    const selectedRoom = event.target.value;
    if (selectedRoom) {
      this.filteredRooms = [selectedRoom];
    } else {
      this.filteredRooms = this.getRoomSlot();
    }
  }

  deleteMeeting(index: number) {
    this.upcomingMeetings.splice(index, 1);
    sessionStorage.setItem('meetings', JSON.stringify(this.upcomingMeetings));
    this.loadMeetings();
  }
}
