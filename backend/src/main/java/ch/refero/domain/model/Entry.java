package ch.refero.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.data.util.Pair;

import ch.refero.domain.model.constraints.ValidColfigIdConstraint;
import ch.refero.domain.model.constraints.ValidRefIdConstraint;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

@Entity
public class Entry {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;
    
    @JoinColumn(name = "ref_id", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential ref;

    @Column(name = "ref_id")
    @NotBlank(message = "ref_id cannot be blank")
    @ValidRefIdConstraint
    public String ref_id;

    /**
     * Persisting this requires a table of record_id (parent_id), key (col_id), 
     * value  schema with primary key that is (entry_id, col_id).
     */
    @ElementCollection
    @CollectionTable(
        name="entry_id_col_id_to_value", 
        joinColumns = {@JoinColumn(name = "entry_id", referencedColumnName = "id")
    })
    @MapKeyColumn(name = "col_id")  // the key of the map is in the col_id column of the Coll table.
    @Column(name = "val")           // the value of the map is in the val column of the Coll table. (value is sql reserved)
    @NotEmpty(message = "Entry must contain a fields map.")
    @Lob
    public Map<String, String> fields;

    @ValidColfigIdConstraint
    private Pair<String, List<String>> getFields() {                  // getFields name is obligatory for the validation to work correctly
        return Pair.of(this.ref_id, new ArrayList<>(this.fields.keySet())); 
    }

    @Override
    public String toString() {
        return "{ ref_id: " + ref_id + " , id:" + id + "}"; 
    }
}
