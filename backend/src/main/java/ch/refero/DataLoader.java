package ch.refero;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import ch.refero.domain.model.Referential;
import ch.refero.domain.repository.ColfigRepository;
//import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.repository.ReferentialRepository;

@Component
public class DataLoader implements ApplicationRunner {

    //@Autowired
    //private EntryRepository entryRepository;

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
        ref.name = "Max Havelar Tomatos Referential";
        ref.description = "Information about tomato varieties.";
        refRepository.save(ref);

        var ref2 = new Referential();
        ref2.name = "Chiquita Bananas Referential";
        ref2.description = "Information about bananas";
        refRepository.save(ref2);
    }

    public void run(ApplicationArguments args) {
        createRefs();
        createCols();
    }
}
