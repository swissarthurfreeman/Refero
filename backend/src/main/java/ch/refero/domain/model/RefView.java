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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;

@Table(
    uniqueConstraints=
        @UniqueConstraint(columnNames={"id", "name"})   // cannot have duplicate id, name pairs
)
@Entity
public class RefView {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;

    @NotBlank(message = "Name of view cannot be blank.")
    public String name;

    @JoinColumn(name = "ref_id", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential ref;

    @Column(name = "ref_id")
    @NotBlank(message = "ref_id cannot be blank")
    @ValidRefIdConstraint
    public String ref_id;

    @ElementCollection
    @Column
    public List<String> dispColIds;
    
    @ElementCollection
    @Column
    public List<String> searchColIds;  
}
