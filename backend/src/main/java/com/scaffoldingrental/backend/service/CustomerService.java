package com.scaffoldingrental.backend.service;


import com.scaffoldingrental.backend.model.Address;
import com.scaffoldingrental.backend.model.Customer;
import com.scaffoldingrental.backend.repository.AddressRepository;
import com.scaffoldingrental.backend.repository.CustomerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository CustomerRepository;

    @Autowired
    private AddressRepository addressRepository;

    public Customer addCustomer(Customer Customer) {
        Address address = Customer.getAddress();
        address = addressRepository.save(address);
        Customer.setAddress(address);
        return CustomerRepository.save(Customer);
    }

    public List<Customer> getAllCustomers() {
        return CustomerRepository.findAll();
    }

    public Customer getCustomerById(Long customerId) {
        return CustomerRepository.findById(customerId).orElse(null);
    }

    @Transactional
    public void deleteCustomerById(Long customerId) {
        CustomerRepository.softDeleteCustomer(customerId);
    }

    public List<Customer> searchCustomer(String search) {
        return CustomerRepository.findByNameContainingIgnoreCaseOrNicContainingIgnoreCase(search, search);
    }

    public Customer updateCustomerName(Long customerId, String name) {
        Customer Customer = CustomerRepository.findById(customerId).orElse(null);
        if (Customer != null) {
            Customer.setName(name);
            return CustomerRepository.save(Customer);
        } else {
            return null;
        }
    }

    public Customer updateCustomerNic(Long customerId, String newNic) {
        Optional<Customer> Customer = CustomerRepository.findById(customerId);
        if (Customer.isPresent()) {
            Customer st = Customer.get();
            st.setNic(newNic);
            CustomerRepository.save(st);
            return st;
        } else {
            return null;
        }
    }

    public Customer updateCustomerEmail(Long customerId, String email) {
        Customer Customer = CustomerRepository.findById(customerId).orElse(null);
        if (Customer != null) {
            Customer.setEmail(email);
            return CustomerRepository.save(Customer);
        } else {
            return null;
        }
    }

    public Customer updateCustomerPhoneNumber(Long customerId, String phoneNumber) {
        Customer Customer = CustomerRepository.findById(customerId).orElse(null);
        if (Customer != null) {
            Customer.setPhoneNumber(phoneNumber);
            return CustomerRepository.save(Customer);
        } else {
            return null;
        }
    }

    public Customer updateCustomerFirstDateDeal(Long customerId, Date date) {
        Customer Customer = CustomerRepository.findById(customerId).orElse(null);
        if (Customer != null) {
            Customer.setFirstDateDeal(new java.sql.Date(date.getTime()).toLocalDate());
            return CustomerRepository.save(Customer);
        } else {
            return null;
        }
    }

    public Customer updateCustomerLastDateDeal(Long customerId, Date date) {
        Customer Customer = CustomerRepository.findById(customerId).orElse(null);
        if (Customer != null) {
            Customer.setLastDateDeal(new java.sql.Date(date.getTime()).toLocalDate());
            return CustomerRepository.save(Customer);
        } else {
            return null;
        }
    }

    public Customer updateCustomerAddress(Long customerId, Address address) {
        Customer Customer = CustomerRepository.findById(customerId).orElse(null);
        if (Customer != null) {
            Address oldAddress = Customer.getAddress();
            oldAddress.setHouseNo(address.getHouseNo());
            oldAddress.setStreet(address.getStreet());
            oldAddress.setCity(address.getCity());
            addressRepository.save(oldAddress);
            return Customer;
        } else {
            return null;
        }
    }

    public int getActiveCustomerCount() {
        List<Customer> customers = CustomerRepository.findByIsDeletedFalse();
        return customers.size();
    }
}
