package ch.refero.domain.model;

import ch.refero.domain.model.constraints.ValidColfigIdConstraint;
import ch.refero.domain.model.constraints.ValidrefidConstraint;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.util.Pair;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Entry {

  @Id
  @Column
  public String id;

  @Column(name = "refid", nullable = false, updatable = false)
  @ValidrefidConstraint
  @NotBlank(message = "refid cannot be blank")
  @NotNull
  public String refid;

  @JsonIgnore
  @JoinColumn(name = "refid", insertable = false, updatable = false)
  @ManyToOne(targetEntity = Referential.class)
  private Referential ref;

  /**
   * record_id, key, value table Persisting this requires a table of record_id (parent_id), key
   * (col_id), value  schema with primary key that is (entry_id, col_id).
   */
  @ElementCollection
  @CollectionTable(
      name = "entry_id_col_id_to_value",
      joinColumns = {@JoinColumn(name = "entry_id", referencedColumnName = "id")})
  @MapKeyColumn(name = "col_id")  // the key of the map is in the col_id column of the Coll table.
  @Column(name = "val", columnDefinition = "TEXT")
  // the value of the map is in the val column of the Coll table. (value is sql reserved)
  @NotEmpty(message = "Entry must contain a fields map.")
  public Map<String, String> fields;

  // check all keys of fields map are valid columns.
  @ValidColfigIdConstraint
  private Pair<String, List<String>> getFields() {                  // getFields name is obligatory for the validation to work correctly
    return Pair.of(this.refid, new ArrayList<>(this.fields.keySet()));
  }
}
