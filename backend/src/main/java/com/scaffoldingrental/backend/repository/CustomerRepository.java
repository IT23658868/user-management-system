package com.scaffoldingrental.backend.repository;

import com.scaffoldingrental.backend.model.Customer;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByNameContainingIgnoreCaseOrNicContainingIgnoreCase(String name, String nic);

    @Modifying
    @Transactional
    @Query("UPDATE Customer u SET u.isDeleted = true WHERE u.customerId = ?1")
    void softDeleteCustomer(Long customerId);

    List<Customer> findByIsDeletedFalse();
}