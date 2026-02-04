package com.scaffoldingrental.backend.controller;


import com.scaffoldingrental.backend.model.Address;
import com.scaffoldingrental.backend.model.Customer;
import com.scaffoldingrental.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/Customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/add-Customer")
    public Customer addCustomer(@RequestBody Customer Customer) {
        return customerService.addCustomer(Customer);
    }

    @GetMapping("/all-Customers")
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/Customer/{customerId}")
    public Customer getCustomerById(@PathVariable Long customerId) {
        return customerService.getCustomerById(customerId);
    }

    @DeleteMapping("/delete-Customer/{customerId}")
    public void deleteCustomer(@PathVariable Long customerId) {
        customerService.deleteCustomerById(customerId);
    }

    @GetMapping("/search-Customer")
    public List<Customer> searchCustomer(@RequestParam String search) {
        return customerService.searchCustomer(search);
    }

    @PutMapping("/update-Customer-name/{customerId}")
    public Customer updateCustomerName(@PathVariable Long customerId, @RequestParam String name) {
        return customerService.updateCustomerName(customerId, name);
    }

    @PutMapping("/update-Customer-Nic/{customerId}")
    public Customer updateCustomerNic(@PathVariable Long customerId, @RequestParam String newNic) {
        return customerService.updateCustomerNic(customerId, newNic);
    }

    @PutMapping("/update-Customer-email/{customerId}")
    public Customer updateCustomerEmail(@PathVariable Long customerId, @RequestParam String email) {
        return customerService.updateCustomerEmail(customerId, email);
    }

    @PutMapping("/update-Customer-phone/{customerId}")
    public Customer updateCustomerPhoneNumber(@PathVariable Long customerId, @RequestParam String phoneNumber) {
        return customerService.updateCustomerPhoneNumber(customerId, phoneNumber);
    }

    @PutMapping("/update-Customer-fristdealdate/{customerId}")
    public Customer updateCustomerFristDealDate(@PathVariable Long customerId, @RequestParam("fristDealDate") @DateTimeFormat(pattern = "yyyy-MM-dd")Date fristDealDate) {
        return customerService.updateCustomerFirstDateDeal(customerId, fristDealDate);
    }

    @PutMapping("/update-Customer-lastdealdate/{customerId}")
    public Customer updateCustomerLastDealDate(@PathVariable Long customerId, @RequestParam("lastDealDate") @DateTimeFormat(pattern = "yyyy-MM-dd")Date lastDealDate) {
        return customerService.updateCustomerLastDateDeal(customerId, lastDealDate);
    }

    @PutMapping("/update-Customer-address/{customerId}")
    public Customer updateCustomerAddress(@PathVariable Long customerId, @RequestBody Address address) {
        return customerService.updateCustomerAddress(customerId, address);
    }

    @GetMapping("/get-Active-Customer-Count")
    public int getActiveCustomerCount() {
        return customerService.getActiveCustomerCount();
    }
}
