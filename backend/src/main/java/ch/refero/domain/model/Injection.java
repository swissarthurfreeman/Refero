package ch.refero.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import ch.refero.domain.model.constraints.ValidrefidConstraint;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Injection {
    @Id
    @Column
    public String id;

    @Column(name = "refid")
    @NotBlank(message = "refid cannot be blank")
    @ValidrefidConstraint
    public String refid;    // id of ref that owns the injection, e.g. destination ref.

    @JsonIgnore
    @JoinColumn(name = "refid", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential ref;

    @Column
    @ValidrefidConstraint
    @NotBlank(message = "srcid cannot be blank")
    public String srcid;

    @JsonIgnore
    @JoinColumn(name = "srcid", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential srcref;

    @Column
    @NotBlank(message = "srcname cannot be blank")
    public String srcname; // allows easy displaying in the frontend without loading pointed ref.

    @ElementCollection
    @CollectionTable(
        name = "srccolid_to_destcolid_mappings",
        joinColumns = {@JoinColumn(name = "injection_id", referencedColumnName = "id")}
    )
    @MapKeyColumn(name = "srccolid")
    @Column(name = "destcolid")
    @NotEmpty(message = "Injection must contain a mappings map") // destination is the ref this injection belongs to.
    public Map<String, String> mappings;        // mapping of { srcColId: destColId... }
}
