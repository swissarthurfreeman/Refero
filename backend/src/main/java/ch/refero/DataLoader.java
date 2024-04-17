package ch.refero;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.model.Entry;
import ch.refero.domain.model.Referential;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.repository.ReferentialRepository;

@Component
public class DataLoader implements ApplicationRunner {

    @Autowired
    private EntryRepository entryRepository;

    @Autowired
    private ReferentialRepository refRepository;

    @Autowired
    public DataLoader(ReferentialRepository refRepository) {
        this.refRepository = refRepository;
    }

    public void createCols() {

    }

    @Autowired
    private ColfigRepository colRepo;


    public void createRefs() {
        var ref = new Referential();
        ref.id = "refid1";
        ref.name = "Name of Referential 1";
        ref.description = "Description of Referential 1";
        refRepository.save(ref);

        var ref2 = new Referential();
        ref2.id = "refid2";
        ref2.name = "Name of Referential 2";
        ref2.description = "Description of Referential 2";
        refRepository.save(ref2);

        Colfig col1 = new Colfig();
        col1.id = "ref1_col1";
        col1.name = "COLUMN_1_OF_REF_1";
        col1.setRef_id(ref.id);
        colRepo.save(col1);

        Colfig col2 = new Colfig();
        col2.id = "ref2_col1";
        col2.name = "COL_OF_REF_2";
        col2.setRef_id(ref2.id);
        colRepo.save(col2);

    }

    public void run(ApplicationArguments args) {
        createRefs();
        createCols();
        /*var rec = new Entry();
        rec.id = "first_id029034";*/
        /*rec.fields = new HashMap<String, String>();
        rec.fields.put("Addresse", "Route des Beilans");
        entryRepository.save(rec);*/
    }
}
