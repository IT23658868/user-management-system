package com.scaffoldingrental.backend.repository;

import com.scaffoldingrental.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Integer> {
}
