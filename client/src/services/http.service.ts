import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public serverName=environment.apiUrl;
  mystring!:any;
  paginatedList: any;
  constructor(private http: HttpClient, private authService:AuthService) {}
 
  updateDoctorAvailability(doctorId:any,availability:any)
  {
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.post(this.serverName+'/api/doctor/availability?doctorId='+doctorId+'&availability='+availability,{},{headers:headers});
  }

  getAllAppointments()
  {
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.get(this.serverName+'/api/receptionist/appointments',{headers:headers});
  }


  getAppointmentByDoctor(id:any)
  {
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);   
    return this.http.get(this.serverName+'/api/doctor/appointments?doctorId='+id,{headers:headers});
  
  }
  getAppointmentByPatient(id:any)
  {
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);   
    return this.http.get(this.serverName+'/api/patient/appointments?patientId='+id,{headers:headers});
  
  }
  ScheduleAppointment( details:any):Observable<any> {  
    debugger;
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.post(this.serverName+'/api/patient/appointment?patientId='+details.patientId+'&doctorId='+details.doctorId,details,{headers:headers});
  }
  ScheduleAppointmentByReceptionist( details:any):Observable<any> {  
    debugger;
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.post(this.serverName+'/api/receptionist/appointment?patientId='+details.patientId+'&doctorId='+details.doctorId,details,{headers:headers});
  }
  reScheduleAppointment( appointmentId:any,formvalue:any):Observable<any> {  
    debugger;
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.put(this.serverName+'/api/receptionist/appointment-reschedule/'+appointmentId,formvalue,{headers:headers});
  }
  
  getDoctors():Observable<any> {
   
    const authToken = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`)
    return this.http.get(this.serverName+`/api/patient/doctors`,{headers:headers});
  }

  Login(details:any):Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.serverName+'/api/user/login',details,{headers:headers});
  }
  registerPatient(details:any):Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.serverName+'/api/patient/register',details,{headers:headers});
  }
  registerDoctors(details:any):Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.serverName+'/api/doctors/register',details,{headers:headers});
  }
  registerReceptionist(details:any):Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.serverName+'/api/receptionist/register',details,{headers:headers});
  }

  usernameExists(username: string): Observable<boolean> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.get<boolean>(this.serverName + '/api/user/exists', { headers: headers, params: { username } });
  }

//   deleteAppointment(details: any) {
//     const authToken = this.authService.getToken();  
//     console.log(details);
//     let headers = new HttpHeaders();
//     headers = headers.set('Content-Type', 'application/json');
//     headers = headers.set('Authorization', `Bearer ${authToken}`);  

//     // Ensure the ID is passed correctly
//     // this.http.delete(this.serverName/api/appointment/delete?appointmentId=${val.id}`, { headers: headers });
//     // this.http.put(this.serverName+/api/appointment/delete?appointmentId='+appointmentId,formvalue,{headers:headers});
//     console.log(this.http.delete(this.serverName+'/api/appointment/delete?appointmentId='+details,{headers:headers}));
// }

deleteAppointment(id:any){
  // alert("HTTP SERVICE"+id);
  const authToken = this.authService.getToken();
   let headers = new HttpHeaders();
   headers = headers.set('Content-Type', 'application/json');
   headers = headers.set('Authorization', `Bearer ${authToken}`);
   return this.http.delete(this.serverName+`/api/appointment/delete/${id}`, { headers: headers });
 }

 checkForTime(details:any):Observable<Boolean>{
  let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
  return this.http.get<boolean>(this.serverName + '/api/user/appointmentTime', { headers: headers, params: { details } });
 }




}
