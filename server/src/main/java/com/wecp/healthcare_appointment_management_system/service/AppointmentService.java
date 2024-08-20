package com.wecp.healthcare_appointment_management_system.service;

import com.wecp.healthcare_appointment_management_system.dto.TimeDto;
import com.wecp.healthcare_appointment_management_system.entity.Appointment;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.entity.Patient;
import com.wecp.healthcare_appointment_management_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorService doctorService;
    
    public Appointment scheduleAppointment(Long patientId, Long doctorId, TimeDto timeDto) {
        Appointment appointment = new Appointment();
        Patient p = patientRepository.findById(patientId).orElse(null);
        Doctor d = doctorService.findDoctorByID(doctorId);
        appointment.setDoctor(d);
        appointment.setPatient(p);
   
        // Get the appointment time from the TimeDto
       
 
        Date appointmentTime = timeDto.getTime();
 
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(appointmentTime);
        calendar.add(Calendar.MINUTE, 30);
        Date endTime = calendar.getTime();
   
        // Create a Calendar object and set its time to the appointment time
   
        // Get the new appointment time from the calendar
   
        // Set the new appointment time
        appointment.setAppointmentTime(endTime);
   
        appointment.setStatus("Scheduled");
        return appointmentRepository.save(appointment);
    }
  
  
      public List<Appointment> getAppointmentsByPatientId(Long patientId){
          return appointmentRepository.getAppointmentsByPatientId(patientId);
      }
  
      public List<Appointment> getAppointments(){
          return appointmentRepository.findAll();
      }
  
      public Appointment rescheduleAppointment(Long appointmentId,TimeDto timeDto){
        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        if(appointment!=null){
          Date appointmentTime = timeDto.getTime();
          Calendar calendar = Calendar.getInstance();
      calendar.setTime(appointmentTime);
      calendar.add(Calendar.MINUTE, 30);
      Date endTime = calendar.getTime();
            appointment.setAppointmentTime(endTime);
            return appointmentRepository.save(appointment);
        }
        return null;
    }
  
      public List<Appointment> getAppointmentsByDoctorId(Long doctorId){
          return appointmentRepository.getAppointmentsByDoctorId(doctorId);
      }
}
