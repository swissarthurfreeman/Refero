package ch.refero.domain.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class RefView {
    @Id
    @Column
    public String id;

    @Column
    public String name;

    @JoinColumn(name = "ref_id", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential ref;

    @Column(name = "ref_id")
    private String ref_id;

    public void setRef_id(String ref_id) { this.ref_id = ref_id; }
    public String getRef_id() { return ref_id; }

    @ElementCollection
    public List<Colfig> dispCols;       // a colfig does not need to have @OneToMany towards view.

    @ElementCollection
    public List<Colfig> searchCols;
}
