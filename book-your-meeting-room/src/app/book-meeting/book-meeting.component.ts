import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-meeting',
  templateUrl: './book-meeting.component.html',
  styleUrls: ['./book-meeting.component.css']
})
export class BookMeetingComponent {
  @Output() closePopup = new EventEmitter<void>();
  @Output() meetingBooked = new EventEmitter<any>();

  // Define form group
  meetingForm: FormGroup;
  allFeildsValid: boolean = false;

  availableRooms: string[] = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6', 'Room 7', 'Room 8', 'Room 9', 'Room 10'];

  constructor(private formBuilder: FormBuilder) {
    // Initialize form group with validators
    this.meetingForm = this.formBuilder.group({
      username: ['', Validators.required],
      meetingDate: ['', [Validators.required, this.validateMeetingDate]],
      startTime: ['', [Validators.required, this.validateTime]],
      endTime: ['', [Validators.required, this.validateTime]],
      roomNumber: ['', Validators.required],
      agenda: ['', Validators.required]
    });
  }

  // Custom validation for meeting date
  validateMeetingDate(control: any) {
    const selectedDate = new Date(control.value);
    // Check if selected date is not Saturday or Sunday
    if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
      return { invalidMeetingDate: true };
    }
    return null;
  }

  // Custom validation for time range
  validateTime(control: any) {
    const value = control.value;
    const hours = value.split(':')[0];
    // Check if time is between 9AM and 6PM
    if (parseInt(hours) < 9 || parseInt(hours) >= 18) {
      return { invalidTime: true };
    }
    return null;
  }

  // Custom validation for start time less than end time
validateTimeRange() {
  if (this.meetingForm.value.startTime && this.meetingForm.value.endTime) {
    let timeStart = new Date()
    let timeEnd = new Date()
    timeStart.setHours(this.meetingForm.value.startTime?.split(':')[0], this.meetingForm.value.startTime?.split(':')[1], 0, 0)
    timeEnd.setHours(this.meetingForm.value.endTime?.split(':')[0], this.meetingForm.value.endTime?.split(':')[1], 0, 0)
    if (this.meetingForm.value.startTime >= this.meetingForm.value.endTime) {
      this.meetingForm.controls['endTime'].setErrors({ invalidTimeRange: true });
    }
    else if (((Number(timeEnd) - Number(timeStart))/60000) < 30) {
      this.meetingForm.controls['endTime'].setErrors({ invalidTimeInterval: true });
    }
    else {
      this.meetingForm.controls['endTime'].setErrors(null);
    }
    this.areFieldsValid()
  }
}


// Custom validation for agenda and room selection visibility
areFieldsValid(): void {
  if (this.meetingForm.controls['meetingDate'].valid && this.meetingForm.controls['startTime'].valid && this.meetingForm.controls['endTime'].valid) {
    if (this.meetingForm.value.startTime <= this.meetingForm.value.endTime) {
      this.allFeildsValid = true
      return
    }
  }
  this.allFeildsValid = false
}


onSubmit() {
  if (this.meetingForm.valid) {
    const meetings = JSON.parse(sessionStorage.getItem('meetings') || '[]');
    meetings.push(this.meetingForm.value);
    sessionStorage.setItem('meetings', JSON.stringify(meetings));
    this.closePopup.emit();
  }
}

  clearForm(): void {
    this.meetingForm.reset();
  }

  onClose() {
    this.closePopup.emit();
  }
}
