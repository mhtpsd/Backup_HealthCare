import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-patient-appointment',
  templateUrl: './patient-appointment.component.html',
  styleUrls: ['./patient-appointment.component.css']
})
export class PatientAppointmentComponent implements OnInit {
  appointmentList: any = [];
  paginatedList: any = []; // This will hold the items for the current page
  filteredAppointments: any = []; // This will hold the filtered appointments for pagination
  currentPage: number = 1; // Current page number
  itemsPerPage: number = 10; // Number of items per page

  constructor(public httpService: HttpService) {}

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;

    this.httpService.getAppointmentByPatient(userId).subscribe((data) => {
      this.appointmentList = data;
      this.appointmentList.sort((a:any,b:any)=>{
        return new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime();
      });
      this.filteredAppointments = [...this.appointmentList]; // Initialize filteredAppointments
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
    this.currentPage = 1; // Reset to the first page after a new search
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
}
