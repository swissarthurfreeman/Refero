package ch.refero.domain.model;

import java.util.Map;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;

@Entity
public class Entry {
    @Id
    @Column(name = "id")
    public String id;
    
    /**
     * Persisting this requires a table of record_id (parent_id), key (col_id), 
     * value  schema with primary key that is (record_id, col_id).
     */
    @ElementCollection
    @CollectionTable(
        name="record_col_id_value", 
        joinColumns = {
            @JoinColumn(name = "record_id", referencedColumnName = "id")
    })
    @MapKeyColumn(name = "col_id")  // the key of the map is in the col_id column of the Coll table.
    @Column(name = "val")           // the value of the map is in the val column of the Coll table. (value is sql reserved)
    public Map<String, String> fields;

    @JoinColumn(name = "ref_id", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential ref;

    @Column(name = "ref_id")
    private String ref_id;

    public void setRef_id(String ref_id) {
        this.ref_id = ref_id;
    }

    public String getRef_id() {
        return ref_id;
    }
}
