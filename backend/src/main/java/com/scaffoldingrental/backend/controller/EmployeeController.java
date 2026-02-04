package com.scaffoldingrental.backend.controller;


import com.scaffoldingrental.backend.model.Address;
import com.scaffoldingrental.backend.model.Employee;
import com.scaffoldingrental.backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/add-employee")
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeService.addEmployee(employee);
    }

    @GetMapping("/get-employee")
    public List<Employee> getAllEmployee() {
        return employeeService.getAllEmployee();
    }

    @DeleteMapping("/delete-employee/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployeeById(id);
    }

    @GetMapping("/search-employee")
    public List<Employee> searchEmployee(@RequestParam String search) {
        return employeeService.searchEmployee(search);
    }

    @GetMapping("/get-employee/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    @PutMapping("/update-employee-Role/{id}")
    public Employee updateEmployeeRole(@PathVariable Long id, @RequestParam String Role) {
        return employeeService.updateEmployeeRole(id, Role);
    }

    @PutMapping("/update-employee-Address/{id}")
    public Employee updateEmployeeAddress(@PathVariable Long id, @RequestBody Address address) {
        return employeeService.updateEmployeeAddress(id, address);
    }

    @PutMapping("/update-employee-Phone/{id}")
    public Employee updateEmployeePhone(@PathVariable Long id, @RequestParam String phone) {
        return employeeService.updateEmployeePhoneNumber(id, phone);
    }

    @PutMapping("/update-employee-Email/{id}")
    public Employee updateEmployeeEmail(@PathVariable Long id, @RequestParam String email) {
        return employeeService.updateEmployeeEmail(id, email);
    }

    @PutMapping("/update-employee-Password/{id}")
    public Employee updateEmployeePassword(@PathVariable Long id, @RequestParam String password) {
        return employeeService.updateEmployeePassword(id, password);
    }

    @PutMapping("/update-employee-Name/{id}")
    public Employee updateEmployeeName(@PathVariable Long id, @RequestParam String name) {
        return employeeService.updateEmployeeName(id, name);
    }

    @PutMapping("/update-employee-Nic/{id}")
    public Employee updateEmployeeNic(@PathVariable Long id, @RequestParam String newNic) {
        return employeeService.updateEmployeeNic(id, newNic);
    }

}