package ch.refero.domain.model;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.AssertTrue;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import ch.refero.domain.model.constraints.ValidrefidConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(
    uniqueConstraints=
        @UniqueConstraint(columnNames={"refid", "name"})   // cannot same name for columns of same referential
)
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Colfig {
    @Id
    @Column
    public String id;
    
    @Column
    @ValidrefidConstraint
    @NotBlank(message = "refid cannot be blank")
    public String refid;

    @Column
    @NotBlank(message = "name cannot be blank")
    public String name;

    @Column
    public boolean required = true;

    @Column
    public String filecolname;  // name of corresponding column in original source
    
    @Column
    @NotNull
    public ColType coltype;  // If jackson tries to serialize a string that's not in the enum, it fails and yields a cannot serialize error to frontend. 

    @Column
    @JsonInclude(Include.NON_NULL)
    public String dateformat; 

    @Column
    @JsonInclude(Include.NON_NULL)
    public String pointedrefid;

    @Column
    @JsonInclude(Include.NON_NULL)
    public String pointedrefcolid;          // either the id of a BK col, or '0', which means we point to PK.

    @Column
    @JsonInclude(Include.NON_NULL)
    public String pointedrefcollabelid;
}
