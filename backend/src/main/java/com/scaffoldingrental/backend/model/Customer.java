
package com.scaffoldingrental.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;


    @Column()
    private String nic;

    @Column(name = "name", length = 255)
    private String name;

    @OneToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @Column(name = "first_date_deal")
    private LocalDate firstDateDeal;

    @Column(name = "last_date_deal")
    private LocalDate lastDateDeal;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "phone_number", length = 255)
    private String phoneNumber;

    @Column(nullable = false)
    private boolean isDeleted = false;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    public LocalDate getFirstDateDeal() { return firstDateDeal; }
    public void setFirstDateDeal(LocalDate firstDateDeal) { this.firstDateDeal = firstDateDeal; }
    public LocalDate getLastDateDeal() { return lastDateDeal; }
    public void setLastDateDeal(LocalDate lastDateDeal) { this.lastDateDeal = lastDateDeal; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
}