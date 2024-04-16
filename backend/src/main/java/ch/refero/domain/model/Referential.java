package ch.refero.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Referential {
    @Id
    @Column
    public String id;
    
    @Column
    public String name;
    
    @Column
    public String description;
}
