package ch.refero.domain.model;

import ch.refero.domain.model.constraints.ValidrefidConstraint;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Colfig {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  public String id;

  @Column(name = "refid", nullable = false, updatable = false)
  @ValidrefidConstraint
  @NotBlank(message = "refid cannot be blank")
  @NotNull
  public String refid;

  @Column
  // TODO : make this blankable, column is then just an import restriction, makes files require a certain header.
  public String name = "";

  @Column
  public boolean required = false;

  @Column
  public String filecolname;  // name of corresponding column in original source

  @Column
  @NotNull
  public ColType coltype;  // If jackson tries to serialize a string that's not in the enum, it fails and yields a cannot serialize error to frontend.

  @Column
  @JsonInclude(Include.NON_NULL)
  public String dateformat;

  @Column
  @JsonInclude(Include.NON_NULL)
  public String pointedrefid;

  @Column
  @JsonInclude(Include.NON_NULL)
  public String pointedrefcolid;          // either the id of a BK col, or '0', which means we point to PK.

  @Column
  @JsonInclude(Include.NON_NULL)
  @ElementCollection
  public List<@NotNull String> pointedrefcollabelids = new ArrayList<>();
}
