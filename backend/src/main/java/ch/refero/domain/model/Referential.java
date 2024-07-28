package ch.refero.domain.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Referential {
    @Id
    @Column
    public String id;
    
    @Column(unique = true)
    @NotBlank(message = "code cannot be blank")
    public String code;

    @Column(unique = true)
    @NotBlank(message = "name cannot be blank")
    public String name;

    @Column
    public String description;

    @OneToMany(targetEntity = Entry.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "refid")
    private List<Entry> entries = new ArrayList<>();

    @OneToMany(targetEntity = Colfig.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "refid")
    public List<Colfig> columns = new ArrayList<>();

    // list of injections to that referential.
    @OneToMany(targetEntity = Injection.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "refid")
    public List<Injection> injections = new ArrayList<>();

    @OneToMany(targetEntity = RefView.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "refid")
    public List<RefView> views = new ArrayList<>();

    @Override
    public String toString() {
        return "{ code: " + code + ", name:" + name + "," + "description:" + description + "}";
    }
}
