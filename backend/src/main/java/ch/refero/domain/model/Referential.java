package ch.refero.domain.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

@Entity
public class Referential {
    @Id
    @Column
    public String id;

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
    
    @Column
    public String name;
    
    @Column
    public String description;

    @OneToMany(targetEntity = Entry.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "ref_id")
    private List<Entry> entries;

    @OneToMany(targetEntity = Colfig.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "ref_id")
    private List<Colfig> columns;

    @ElementCollection
    private List<RefView> views;

    public Referential() {}
}
