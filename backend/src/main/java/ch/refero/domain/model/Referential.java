package ch.refero.domain.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Referential {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column
    public String id;

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
    
    @Column(unique = true)
    @NotBlank(message = "Name cannot be blank!")
    public String name;

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    @Column
    @NotBlank(message = "Description cannot be blank!")
    public String description;

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    @OneToMany(targetEntity = Entry.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "ref_id")
    private List<Entry> entries;

    @OneToMany(targetEntity = Colfig.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "ref_id")
    private List<Colfig> columns;

    //@ElementCollection
    //private List<RefView> views;

    public Referential() {}

    @Override
    public String toString() {
        return "{ name:" + name + "," + "description:" + description + "}";
    }
}
