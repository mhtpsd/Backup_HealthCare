import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-receptionist-schedule-appointments',
  templateUrl: './receptionist-schedule-appointments.component.html',
  styleUrls: ['./receptionist-schedule-appointments.component.scss'],
  providers: [DatePipe] 
  
})
export class ReceptionistScheduleAppointmentsComponent implements OnInit {
  
  itemForm: FormGroup;
  formModel:any={};
  responseMessage:any;
  isAdded: boolean=false;
  today!: string;
  minDate: any;
  
  constructor(public httpService:HttpService,private formBuilder: FormBuilder,private datePipe: DatePipe) {
    this.itemForm = this.formBuilder.group({
      patientId: [this.formModel.patientId,[ Validators.required]],
      doctorId: [this.formModel.doctorId,[ Validators.required]],
      time: [this.formModel.time,[
        Validators
        .required],[this.timeValidator()]],
  });
   }

  ngOnInit(): void {
  
    this.setMinDate() 
  }

  timeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log("Front END: " + control.value);
      // Convert the datetime-local string to an ISO 8601 string
      let isoDateTime = control.value + ":00.000Z";
      return this.httpService.appointmentTimeExists(isoDateTime).pipe(
        map(isTaken => {
          if (isTaken) {
            return { negativeValue: true };
          } else {
            return null;
          }
        }),
        catchError(() => of(null))
      );
    };
  }    

  onSubmit()
  {
    debugger;
    const selectedTime = new Date(this.itemForm.controls['time'].value);
    const now = new Date();

    if (isNaN(selectedTime.getTime())) {
      if (selectedTime < now) {
        this.responseMessage = "Cannot book an appointment in the past.";
        return; // Prevent the form submission
      }
    }
    const formattedTime = this.datePipe.transform(this.itemForm.controls['time'].value, 'yyyy-MM-dd HH:mm:ss');

    // Update the form value with the formatted date
    this.itemForm.controls['time'].setValue(formattedTime);
    this.httpService.ScheduleAppointmentByReceptionist( this.itemForm.value).subscribe((data)=>{
   
      this.itemForm.reset();
      this.responseMessage="Appointment Save Successfully";
      this.isAdded=false;
    })
    
  }

  setMinDate() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    this.minDate = today.toISOString().slice(0, 16);
  }
}
