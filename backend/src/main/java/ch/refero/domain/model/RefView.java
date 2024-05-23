package ch.refero.domain.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.util.Pair;

import ch.refero.domain.model.constraints.ValidColfigIdConstraint;
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
        @UniqueConstraint(columnNames={"ref_id", "name"})   // cannot have duplicate id, name pairs
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

    @Column
    @ElementCollection
    public List<String> dispColIds = new ArrayList<>();

    @ValidColfigIdConstraint
    private Pair<String, List<String>> getDispColIds() {
        return Pair.of(this.ref_id, this.dispColIds);
    }
    
    @Column
    @ElementCollection
    public List<String> searchColIds = new ArrayList<>();  

    @ValidColfigIdConstraint
    private Pair<String, List<String>> getSearchColIds() {
        return Pair.of(this.ref_id, this.searchColIds);
    }
}
