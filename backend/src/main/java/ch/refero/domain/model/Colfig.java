package ch.refero.domain.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;

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
    @NotBlank(message = "ColType has to be one of FK, BK or NONE")
    public String colType;  // TODO : change this to enum of col types.

    @Column
    @JsonInclude(Include.NON_NULL)
    public String dateFormat; 

    @Column
    @JsonInclude(Include.NON_NULL)
    public String pointedRefId;

    @Column
    @JsonInclude(Include.NON_NULL)
    public String pointedRefColId;

    @AssertTrue(message = "pointedRef and pointedRefColId are required when colType is FK")
    private boolean isValidFk() {
        return !(colType.equals("FK")) || !(pointedRefId == null || pointedRefColId == null);
    }

    @AssertTrue(message = "dateFormat must be proivded when colType is DATE")
    private boolean isValidDate() {
        return !(colType.equals("DATE")) || !(dateFormat == null);
    }

    public Colfig() {};
}
