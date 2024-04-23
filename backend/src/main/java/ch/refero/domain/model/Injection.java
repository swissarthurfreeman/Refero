package ch.refero.domain.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Injection {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;

    @Column
    @NotBlank(message = "srcId cannot be blank")
    public String srcId;

    @Column
    @NotBlank(message = "srcName cannot be blank")
    public String srcName;
    
    @JoinColumn(name = "ref_id", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Referential.class)
    private Referential ref;

    @Column(name = "ref_id")
    @NotBlank(message = "ref_id field cannot be blank!")
    private String ref_id;

    public void setRef_id(String ref_id) {
        this.ref_id = ref_id;
    }

    public String getRef_id() {
        return ref_id;
    }

    @ElementCollection
    public List<String> srcColIds;

    @ElementCollection
    public List<String> destColIds;

}
