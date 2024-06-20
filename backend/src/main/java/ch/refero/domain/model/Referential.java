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
import jakarta.validation.constraints.NotNull;

@Entity
public class Referential {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column
    public String id;
    
    @Column(unique = true)
    @NotBlank(message = "Code cannot be blank!")
    @NotNull
    public String code;

    @Column(unique = true)
    @NotBlank(message = "Name cannot be blank!")
    @NotNull
    public String name;

    @Column
    @NotNull
    public String description;

    @OneToMany(targetEntity = Entry.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "refid")
    private List<Entry> entries;

    @OneToMany(targetEntity = Colfig.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "refid")
    public List<Colfig> columns;

    @OneToMany(targetEntity = Injection.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "refid")
    public List<Injection> injections;

    @OneToMany(targetEntity = RefView.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "refid")
    public List<RefView> views;

    @Override
    public String toString() {
        return "{ name:" + name + "," + "description:" + description + "}";
    }
}
