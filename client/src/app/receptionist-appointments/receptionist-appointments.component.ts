import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

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
  paginatedList: any = [];
  isAdded: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10; // Number of items per page

  constructor(public httpService: HttpService, private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.itemForm = this.formBuilder.group({
      id: [this.formModel.id, [Validators.required]],
      time: [this.formModel.time, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments() {
    this.httpService.getAllAppointments().subscribe((data) => {
      this.appointmentList = data;

      // Sort the appointments by appointmentTime in ascending order
      this.appointmentList.sort((a: any, b: any) => {
        return new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime();
      });

      this.updatePaginatedList();
    });
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.appointmentList.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedList();
  }

  get totalPages(): number {
    return Math.ceil(this.appointmentList.length / this.itemsPerPage);
  }

  editAppointment(val: any) {
    this.itemForm.controls['id'].setValue(val.id);
    this.isAdded = true;
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
}