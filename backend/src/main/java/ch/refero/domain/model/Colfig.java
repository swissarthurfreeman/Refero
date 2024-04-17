package ch.refero.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Colfig {
    @Id
    @Column(name = "id")
    public String id;
    
    @JoinColumn(name = "ref_id", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential ref;

    @Column(name = "ref_id")
    private String ref_id;

    public void setRef_id(String ref_id) {
        this.ref_id = ref_id;
    }

    public String getRef_id() {
        return ref_id;
    }

    @Column
    public String name;
    
    @Column
    public String colType;

    @Column
    public String dateFormat; 

    @Column
    public String pointedRef;

    @Column
    public String pointedRefColId;

    public Colfig() {};
}
