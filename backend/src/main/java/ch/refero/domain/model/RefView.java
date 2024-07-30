package ch.refero.domain.model;

import ch.refero.domain.model.constraints.ValidrefidConstraint;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"refid", "name"}
    )
)
@Entity     // cannot have duplicate (id, name) pairs
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RefView {

  @Id
  @Column
  public String id;

  @Column(name = "name")
  @NotBlank(message = "name cannot be blank.")
  public String name;

  @Column(name = "refid", nullable = false, updatable = false)
  @NotBlank(message = "refid cannot be blank.")
  @ValidrefidConstraint
  public String refid;

  @ElementCollection
  public List<@NotNull String> dispcolids = new ArrayList<>();

  @ElementCollection
  public List<@NotNull String> searchcolids = new ArrayList<>();
}
