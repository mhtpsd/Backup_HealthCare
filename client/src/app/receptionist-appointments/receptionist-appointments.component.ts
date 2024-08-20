import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-receptionist-appointments',
  templateUrl: './receptionist-appointments.component.html',
  styleUrls: ['./receptionist-appointments.component.css'],
  providers: [DatePipe]
})
export class ReceptionistAppointmentsComponent implements OnInit {
  itemForm: FormGroup;
  formModel: any = {};
  responseMessage: any;
  appointmentList: any = [];
  filteredAppointments: any = [];
  paginatedList: any = [];
  isAdded: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 5; // Number of items per page
  minDate: any;

  constructor(public httpService: HttpService, private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.itemForm = this.formBuilder.group({
      id: [this.formModel.id, [Validators.required]],
      time: [this.formModel.time, [Validators.required],[this.timeValidator()]],
    });
  }

  ngOnInit(): void {
    this.getAppointments();
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

  getAppointments() {
    this.httpService.getAllAppointments().subscribe((data) => {
      this.appointmentList = data;

      // Sort the appointments by appointmentTime in ascending order
      this.appointmentList.sort((a: any, b: any) => {
        return new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime();
      });

      this.filteredAppointments = [...this.appointmentList];
      this.updatePaginatedList();
    });
  }

  searchAppointments(event: any) {
    const searchTerm = event.target.value.trim().toLowerCase();
    if (!searchTerm) {
      this.filteredAppointments = [...this.appointmentList];
    } else {
      this.filteredAppointments = this.appointmentList.filter((appointment: any) =>
        appointment.doctor.username.toLowerCase().includes(searchTerm) ||
        appointment.id.toString().includes(searchTerm)
      );
    }
    this.currentPage = 1; // Reset to the first page after a search
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.filteredAppointments.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedList();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
  }

  editAppointment(val: any) {
    this.itemForm.controls['id'].setValue(val.id);
    this.isAdded = true;
  }

  deleteAppointment(val: any):any {
    // Confirm with the user
        // Find the index of the appointment in the paginatedList array
        const index = this.paginatedList.findIndex((appointment: { id: any }) => appointment.id === val.id);
        if(index!=-1){
          this.httpService.deleteAppointment(val.id).subscribe(()=>{
            this.getAppointments();
            console.log(val.id);
          })
        }

        // Remove the appointment from the array
        if (index > -1) {
            this.paginatedList.splice(index, 1);
        }
}

  onSubmit() {
    const formattedTime = this.datePipe.transform(this.itemForm.controls['time'].value, 'yyyy-MM-dd HH:mm:ss');
    this.itemForm.controls['time'].setValue(formattedTime);

    this.httpService.reScheduleAppointment(this.itemForm.controls['id'].value, this.itemForm.value).subscribe(() => {
      this.itemForm.reset();
      this.responseMessage = 'Appointment Rescheduled Successfully';
      this.isAdded = false;
      this.getAppointments();
    });
  }

  setMinDate() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    this.minDate = today.toISOString().slice(0, 16);
  }
}
