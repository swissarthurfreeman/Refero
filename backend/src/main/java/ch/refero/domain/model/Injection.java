package ch.refero.domain.model;

import java.util.List;

import ch.refero.domain.model.constraints.ValidRefIdConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Injection {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;

    @Column
    @NotBlank(message = "srcId cannot be blank")
    public String srcId;

    @Column
    @NotBlank(message = "srcName cannot be blank")
    public String srcName;
    
    @JoinColumn(name = "ref_id", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential ref;

    @Column(name = "ref_id")
    @NotBlank(message = "ref_id cannot be blank")
    @ValidRefIdConstraint
    public String ref_id;

    @ElementCollection
    public List<String> srcColIds;

    @ElementCollection
    public List<String> destColIds;

}
