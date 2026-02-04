
package com.scaffoldingrental.backend.service;


import com.scaffoldingrental.backend.model.Address;
import com.scaffoldingrental.backend.model.Employee;
import com.scaffoldingrental.backend.repository.AddressRepository;
import com.scaffoldingrental.backend.repository.EmployeeRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private AddressRepository addressRepository;

    public Employee addEmployee(Employee employee) {
        Address address = employee.getAddress();
        address = addressRepository.save(address);
        employee.setAddress(address);
        String hashed  = BCrypt.hashpw(employee.getPassword(), BCrypt.gensalt());
        employee.setPassword(hashed);
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployee() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public void deleteEmployeeById(Long id) {
        employeeRepository.deleteById(id);
    }


    public List<Employee> searchEmployee(String search) {

        return employeeRepository.findByNameContainingIgnoreCaseOrNicContainingIgnoreCase(search, search);
    }

    public Employee updateEmployeePhoneNumber(Long id, String phoneNumber) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            Employee st = employee.get();
            st.setPhoneNumber(phoneNumber);
            employeeRepository.save(st);
            return st;
        } else {
            return null;
        }
    }

    public Employee updateEmployeeEmail(Long id, String email) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            Employee st = employee.get();
            st.setEmail(email);
            employeeRepository.save(st);
            return st;
        } else {
            return null;
        }
    }

    public Employee updateEmployeePassword(Long id, String password) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            Employee st = employee.get();
            String hashed = BCrypt.hashpw(password, BCrypt.gensalt());
            st.setPassword(hashed);
            employeeRepository.save(st);
            return st;
        } else {
            return null;
        }
    }

    public Employee updateEmployeeAddress(Long id, Address address) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            Employee st = employee.get();
            Address oldAddress = st.getAddress();
            oldAddress.setHouseNo(address.getHouseNo());
            oldAddress.setStreet(address.getStreet());
            oldAddress.setCity(address.getCity());
            addressRepository.save(oldAddress);
            return st;
        } else {
            return null;
        }
    }

    public Employee updateEmployeeRole(Long id, String role) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            Employee st = employee.get();
            String normalizedRole = role.substring(0, 1).toUpperCase() + role.substring(1).toLowerCase();
            st.setRole(Employee.Role.valueOf(normalizedRole));
            employeeRepository.save(st);
            return st;
        } else {
            return null;
        }
    }

    public Employee updateEmployeeName(Long id, String name) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            Employee st = employee.get();
            st.setName(name);
            employeeRepository.save(st);
            return st;
        } else {
            return null;
        }
    }

    public Employee updateEmployeeNic(Long id, String newNic) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            Employee st = employee.get();
            st.setNic(newNic);
            employeeRepository.save(st);
            return st;
        } else {
            return null;
        }
    }
}