package ch.refero.domain.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ch.refero.domain.model.constraints.ValidrefidConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;

@Table(
    uniqueConstraints=
        @UniqueConstraint(columnNames={"refid", "name"})   // cannot same name for columns of same referential
)
@Entity
public class Colfig {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column
    public String id;

    
    @Column(name = "refid")
    @ValidrefidConstraint
    @NotBlank(message = "refid cannot be blank")
    public String refid;

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
    public String pointedrefid;

    @Column
    @JsonInclude(Include.NON_NULL)
    public String pointedRefColId;

    @Column
    @JsonInclude(Include.NON_NULL)
    public String pointedRefColLabelId;
    

    @AssertTrue(message = "pointedRef and pointedRefColId are required when colType is FK")
    private boolean isValidFk() {
        return !("FK".equals(this.colType)) || !(pointedrefid == null || pointedRefColId == null || pointedRefColLabelId == null);
    }

    @AssertTrue(message = "dateFormat must be proivded when colType is DATE")
    private boolean isValidDate() {
        return !("DATE".equals(colType)) || !(dateFormat == null);
    }

    public Colfig() {};
}
