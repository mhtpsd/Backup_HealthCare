package com.wecp.healthcare_appointment_management_system.controller;
import com.wecp.healthcare_appointment_management_system.dto.LoginRequest;
import com.wecp.healthcare_appointment_management_system.dto.LoginResponse;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.entity.Patient;
import com.wecp.healthcare_appointment_management_system.entity.Receptionist;
import com.wecp.healthcare_appointment_management_system.entity.User;
import com.wecp.healthcare_appointment_management_system.jwt.JwtUtil;
import com.wecp.healthcare_appointment_management_system.service.UserService;

import com.wecp.healthcare_appointment_management_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.wecp.healthcare_appointment_management_system.repository.*;

import com.wecp.healthcare_appointment_management_system.entity.Appointment;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    private AuthenticationManager authenticationManager;


    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/api/patient/register")
    public ResponseEntity<Patient> registerPatient(@RequestBody Patient patient) {
        Patient registeredPatient = (Patient) userService.registerUser(patient);
        return new ResponseEntity<>(registeredPatient, HttpStatus.CREATED);
    }

    @PostMapping("/api/doctors/register")
    public ResponseEntity<Doctor> registerDoctor(@RequestBody Doctor doctor) {
        Doctor registeredDoctor = (Doctor) userService.registerUser(doctor);
        return new ResponseEntity<>(registeredDoctor, HttpStatus.CREATED);
    }

    @PostMapping("/api/receptionist/register")
    public ResponseEntity<Receptionist> registerReceptionist(@RequestBody Receptionist receptionist) {
        Receptionist registeredReceptionist = (Receptionist) userService.registerUser(receptionist);
        return new ResponseEntity<>(registeredReceptionist, HttpStatus.CREATED);
    }

    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        User user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (user != null) {

            String tokens= jwtUtil.generateToken(loginRequest.getUsername());
            
            LoginResponse response = new LoginResponse(user.getId(),tokens, user.getUsername(), user.getEmail(), user.getRole());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/api/user/exists")
    public ResponseEntity<Boolean> userExists(@RequestParam String username) {
    User user = userService.getUserByUsername(username);
    return ResponseEntity.ok(user != null);
    }

    @DeleteMapping("/api/appointment/delete/{appointmentId}")
    public ResponseEntity<Boolean> deleteAppointment(@PathVariable Long appointmentId) {
    // Check if the appointment exists before deleting
    
    if (appointmentRepository.existsById(appointmentId)) {
        appointmentRepository.deleteById(appointmentId);
        return ResponseEntity.ok().build();
    } else {
        return ResponseEntity.notFound().build(); // Return 404 if the appointment doesn't exist
    }
}

@GetMapping("/api/user/appointmentTime/{time}")
public ResponseEntity<Boolean> appointmentTimeExists(@PathVariable String time) {
    try {
        // Define the date format
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
 
        // Parse the date-time string
        Date startTime = format.parse(time);
 
        // Add 30 minutes to get the end of the time range
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startTime);
        calendar.add(Calendar.MINUTE, 30);
        Date endTime = calendar.getTime();
 
        // Check if any appointment exists within the 30-minute window
        List<Appointment> appointments = appointmentRepository.findByAppointmentTimeBetween(startTime, endTime);
        boolean appointmentExists = appointments != null && !appointments.isEmpty();
 
        return ResponseEntity.ok(appointmentExists);
    } catch (ParseException e) {
        // Handle the exception
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
    

}