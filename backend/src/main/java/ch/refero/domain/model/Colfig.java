package ch.refero.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Table(
    uniqueConstraints=
        @UniqueConstraint(columnNames={"id", "name"})   // cannot have duplicate column names.
)
@Entity
public class Colfig {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
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

    @Column()
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
