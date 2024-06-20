package ch.refero.domain.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.util.Pair;

import com.fasterxml.jackson.annotation.JsonIgnore;

import ch.refero.domain.model.constraints.UniquerefidViewNameConstraint;
import ch.refero.domain.model.constraints.ValidColfigIdConstraint;
import ch.refero.domain.model.constraints.ValidrefidConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;

@Table(
    uniqueConstraints=
        @UniqueConstraint(columnNames={"refid", "name"})   // cannot have duplicate id, name pairs
)
@Entity
@UniquerefidViewNameConstraint   // for catching this at validation level
public class RefView {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;

    @NotBlank(message = "Name of view cannot be blank.")
    public String name;

    @Column(name = "refid")
    @NotBlank(message = "refid cannot be blank")
    @ValidrefidConstraint
    public String refid;

    @Column
    @ElementCollection
    public List<String> dispColIds = new ArrayList<>();

    @ValidColfigIdConstraint
    private Pair<String, List<String>> getDispColIds() {
        return Pair.of(this.refid, this.dispColIds);
    }
    
    @Column
    @ElementCollection
    public List<String> searchColIds = new ArrayList<>();  

    @ValidColfigIdConstraint
    private Pair<String, List<String>> getSearchColIds() {
        return Pair.of(this.refid, this.searchColIds);
    }
}
