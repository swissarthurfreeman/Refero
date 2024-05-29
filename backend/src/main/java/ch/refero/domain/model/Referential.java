package ch.refero.domain.model;

import java.util.List;

import jakarta.persistence.Column;
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
    
    @Column(unique = true)
    @NotBlank(message = "Name cannot be blank!")
    public String name;

    @Column
    public String description;

    @OneToMany(targetEntity = Entry.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "ref_id")
    private List<Entry> entries;

    @OneToMany(targetEntity = Colfig.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "ref_id")
    public List<Colfig> columns;

    @OneToMany(targetEntity = Injection.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "ref_id")
    public List<Injection> injections;

    @OneToMany(targetEntity = RefView.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "ref_id")
    public List<RefView> views;

    @Override
    public String toString() {
        return "{ name:" + name + "," + "description:" + description + "}";
    }
}
