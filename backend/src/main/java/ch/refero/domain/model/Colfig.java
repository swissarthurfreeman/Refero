package ch.refero.domain.model;

import org.springframework.lang.NonNull;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ch.refero.domain.model.constraints.ValidRefIdConstraint;
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
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;

@Table(
    uniqueConstraints=
        @UniqueConstraint(columnNames={"id", "name"})   // cannot have duplicate id, name pairs
)
@Entity
public class Colfig {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column
    public String id;
    
    // TODO : think about why we had this thing ?
    //@JoinColumn(name = "ref_id", insertable = false, updatable = false)
    //@ManyToOne(targetEntity = Referential.class)
    //private Referential ref;

    
    @Column(name = "ref_id")
    @ValidRefIdConstraint
    @NotBlank(message = "ref_id cannot be blank")
    public String ref_id;                                          // TODO : investigate @ForeignKey() annotation

    @Column()
    public String name;

    @Column()
    public boolean required = true;

    @Column()
    public String fileColName;  // name of corresponding column in original source
    
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

    @Column
    @JsonInclude(Include.NON_NULL)
    public String pointedRefColLabelId;
    

    @AssertTrue(message = "pointedRef and pointedRefColId are required when colType is FK")
    private boolean isValidFk() {
        return !("FK".equals(this.colType)) || !(pointedRefId == null || pointedRefColId == null || pointedRefColLabelId == null);
    }

    @AssertTrue(message = "dateFormat must be proivded when colType is DATE")
    private boolean isValidDate() {
        return !("DATE".equals(colType)) || !(dateFormat == null);
    }

    public Colfig() {};
}
