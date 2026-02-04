package com.scaffoldingrental.backend.repository;


import com.scaffoldingrental.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {


    List<Employee> findByNameContainingIgnoreCaseOrNicContainingIgnoreCase(String search, String search1);

}