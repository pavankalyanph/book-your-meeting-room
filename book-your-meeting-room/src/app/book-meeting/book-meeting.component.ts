import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-meeting',
  templateUrl: './book-meeting.component.html',
  styleUrls: ['./book-meeting.component.css']
})
export class BookMeetingComponent {
  @Output() closePopup = new EventEmitter<void>();

  // Define form group
  meetingForm: FormGroup;

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
  const startTime = this.meetingForm.get('startTime')?.value;
  const endTimeControl = this.meetingForm.get('endTime');
  
  if (endTimeControl) {
    const endTime = endTimeControl.value;
    
    if (startTime >= endTime) {
      endTimeControl.setErrors({ invalidTimeRange: true });
    } else {
      endTimeControl.setErrors(null);
    }
  }
}


// Custom validation for agenda and room selection visibility
areFieldsValid(): boolean {
  const startTimeControl = this.meetingForm.get('startTime');
  const endTimeControl = this.meetingForm.get('endTime');
  const meetingDateControl = this.meetingForm.get('meetingDate');

  // Perform null check before accessing values
  if (startTimeControl && endTimeControl && meetingDateControl) {
    const isValidMeetingDate = meetingDateControl.valid ?? false;
    return (
      this.meetingForm.valid &&
      startTimeControl.value < endTimeControl.value &&
      isValidMeetingDate
    );
  }
  return false;
}


  onSubmit() {
    if (this.meetingForm.valid) {
      // Do something with the form data
      console.log(this.meetingForm.value);
    }
  }

  clearForm(): void {
    this.meetingForm.reset();
  }

  onClose() {
    this.closePopup.emit();
  }
}
