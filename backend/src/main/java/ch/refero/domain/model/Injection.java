package ch.refero.domain.model;

import java.util.List;

import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ElementCollection;
import jakarta.validation.constraints.NotBlank;
import ch.refero.domain.model.constraints.ValidrefidConstraint;

@Entity
public class Injection {
    @Id
    @Column
    public String id;

    @Column
    @NotBlank(message = "srcId cannot be blank")
    public String srcid;

    @Column
    @NotBlank(message = "srcName cannot be blank")
    public String srcname;
    
    @JoinColumn(name = "refid", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential ref;

    @Column(name = "refid")
    @NotBlank(message = "refid cannot be blank")
    @ValidrefidConstraint
    public String refid;

    @ElementCollection
    public List<String> srccolids;

    @ElementCollection
    public List<String> destcolids;

}
