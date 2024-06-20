package ch.refero.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.data.util.Pair;

import com.google.gson.annotations.Expose;

import ch.refero.domain.model.constraints.ValidColfigIdConstraint;
import ch.refero.domain.model.constraints.ValidrefidConstraint;
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
    @Expose
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;
    
    @JoinColumn(name = "refid", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential ref;

    @Column(name = "refid")
    @Expose
    @NotBlank(message = "refid cannot be blank")
    @ValidrefidConstraint
    public String refid;

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
    @Column(name = "val", columnDefinition="TEXT")           // the value of the map is in the val column of the Coll table. (value is sql reserved)
    @NotEmpty(message = "Entry must contain a fields map.")
    @Expose
    public Map<String, String> fields;

    @ValidColfigIdConstraint
    private Pair<String, List<String>> getFields() {                  // getFields name is obligatory for the validation to work correctly
        return Pair.of(this.refid, new ArrayList<>(this.fields.keySet())); 
    }
}
