package ch.refero;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import ch.refero.domain.model.Entry;
import ch.refero.domain.model.Referential;
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

    public void run(ApplicationArguments args) {
        // userRepository.save(new User("lala", "lala", "lala"));
        var ref = new Referential();
        ref.id = "askjasl39493";
        ref.name = "test";
        ref.description = "testerooo";
        refRepository.save(ref);

        var ref2 = new Referential();
        ref2.id = "test38420935";
        ref2.name = "lol";
        ref2.description = "aAAAAAAAAAAA";
        refRepository.save(ref2);

        
        var rec = new Entry();
        rec.id = "first_id029034";
        rec.fields = new HashMap<String, String>();
        rec.fields.put("Addresse", "Route des Beilans");
        entryRepository.save(rec);
    }
}
