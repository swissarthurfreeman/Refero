package ch.refero;


import java.util.Arrays;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.model.Entry;
import ch.refero.domain.model.Injection;
import ch.refero.domain.model.RefView;
import ch.refero.domain.model.Referential;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.repository.InjectionRepository;
import ch.refero.domain.repository.ReferentialRepository;
import ch.refero.domain.repository.ViewRepository;

@Component
public class DataLoader implements ApplicationRunner {
    @Autowired
    private ReferentialRepository refRepository;

    @Autowired
    private ColfigRepository colRepository;

    @Autowired
    private ViewRepository viewRepository;
    
    @Autowired
    private EntryRepository entryRepository;
    
    @Autowired
    private InjectionRepository injectionRepository;

    @Autowired
    public DataLoader(ReferentialRepository refRepository) {
        this.refRepository = refRepository;
    }

    public void createCols() {

    }

    public Referential createRef2() {
        var ref2 = new Referential();
        ref2.name = "Chiquita Bananas Referential";
        ref2.description = "Information about bananas";
        refRepository.save(ref2);

        var col1_ref2 = new Colfig();
        col1_ref2.refid = ref2.id;
        col1_ref2.colType = "NONE";
        col1_ref2.name = "Average Diameter";
        colRepository.save(col1_ref2);        

        var col2_ref2 = new Colfig();
        col2_ref2.refid = ref2.id;
        col2_ref2.colType = "NONE";
        col2_ref2.name = "Color";
        colRepository.save(col2_ref2);

        var col3_ref2 = new Colfig();
        col3_ref2.refid = ref2.id;
        col3_ref2.colType = "NONE";
        col3_ref2.name = "Name";
        colRepository.save(col3_ref2);

        var view = new RefView();
        view.refid = ref2.id;
        view.name = "COOL_VIEW";

        String disp1[] = {col3_ref2.id, col1_ref2.id};
        view.dispColIds = Arrays.asList(disp1);

        String search1[] = {col2_ref2.id};
        view.searchColIds = Arrays.asList(search1);
        viewRepository.save(view);
        return ref2;
    }

    public void createEntriesOfRef2(String id) {
        var ref2 = this.refRepository.findById(id).get();

        var rec1 = new Entry();
        rec1.refid = ref2.id;
        rec1.fields = new HashMap<String, String>();
        rec1.fields.put(ref2.columns.get(0).id, "25cm"); // Mean Diameter
        rec1.fields.put(ref2.columns.get(1).id, "Yellow"); // Color
        rec1.fields.put(ref2.columns.get(2).id, "Bananus Shlongus"); // Latin Name
        entryRepository.save(rec1);

        var rec2 = new Entry();
        rec2.refid = ref2.id;
        rec2.fields = new HashMap<String, String>();
        rec2.fields.put(ref2.columns.get(0).id, "50cm"); // Mean Diameter
        rec2.fields.put(ref2.columns.get(1).id, "Scarlet Yellow"); // Color
        rec2.fields.put(ref2.columns.get(2).id, "Longus Bananis"); // Latin Name
        entryRepository.save(rec2);

    }

    public void createEntriesOfRef1(String id) {
        var rec1 = new Entry();
        var ref1 = this.refRepository.findById(id).get();
        rec1.refid = ref1.id;
        rec1.fields = new HashMap<String, String>();
        rec1.fields.put(ref1.columns.get(0).id, "20cm"); // Mean Diameter
        rec1.fields.put(ref1.columns.get(1).id, "Bright Red"); // Color
        rec1.fields.put(ref1.columns.get(2).id, "Tomatus Nautilus"); // Latin Name
        entryRepository.save(rec1);

        var rec2 = new Entry();
        rec2.refid = ref1.id;
        rec2.fields = new HashMap<String, String>();
        rec2.fields.put(ref1.columns.get(0).id, "30cm"); // Mean Diameter
        rec2.fields.put(ref1.columns.get(1).id, "Scarlet Red"); // Color
        rec2.fields.put(ref1.columns.get(2).id, "Tomatus Fattus"); // Latin Name
        entryRepository.save(rec2);

        var rec3 = new Entry();
        rec3.refid = ref1.id;
        rec3.fields = new HashMap<String, String>();
        rec3.fields.put(ref1.columns.get(0).id, "15cm"); // Mean Diameter
        rec3.fields.put(ref1.columns.get(1).id, "Blood Red"); // Color
        rec3.fields.put(ref1.columns.get(2).id, "Tomatus Vampirus"); // Latin Name
        entryRepository.save(rec3);
    } 

    public Referential createRef1() {
        var ref1 = new Referential();
        ref1.name = "Max Havelar Tomatos Referential";
        ref1.description = "Information about tomato varieties.";
        refRepository.save(ref1);

        var col1_ref1 = new Colfig();
        col1_ref1.refid = ref1.id;
        col1_ref1.colType = "NONE";
        col1_ref1.name = "Mean diameter";
        colRepository.save(col1_ref1);        

        var col2_ref1 = new Colfig();
        col2_ref1.refid = ref1.id;
        col2_ref1.colType = "NONE";
        col2_ref1.name = "Colour";
        colRepository.save(col2_ref1);

        var col3_ref1 = new Colfig();
        col3_ref1.refid = ref1.id;
        col3_ref1.colType = "BK";
        col3_ref1.name = "Latin Name";
        colRepository.save(col3_ref1);

        var view = new RefView();
        view.refid = ref1.id;
        view.name = "NICE_VIEW";

        String disp1[] = {col3_ref1.id, col1_ref1.id};
        view.dispColIds = Arrays.asList(disp1);

        String search1[] = {col2_ref1.id};
        view.searchColIds = Arrays.asList(search1);
        viewRepository.save(view);
        return ref1;
    }

    public void CreateInjection(Referential ref1, Referential ref2) {
        var dest = this.refRepository.findById(ref1.id).get();
        var src = this.refRepository.findById(ref2.id).get();
        

        Injection inj = new Injection();
        inj.refid = dest.id; // injection from bananas to tomatos, tomatos ref owns the injection
        inj.srcId = src.id;
        inj.srcName = src.name;

        // simple injection
        String[] destColIds = {dest.columns.get(0).id, dest.columns.get(1).id, dest.columns.get(2).id, };
        String[] srcColIds = {src.columns.get(0).id, src.columns.get(1).id, src.columns.get(2).id};
        inj.destColIds = Arrays.asList(destColIds);
        inj.srcColIds = Arrays.asList(srcColIds);
        injectionRepository.save(inj);
    }

    public void run(ApplicationArguments args) {
        /*Referential ref1 = createRef1();
        createEntriesOfRef1(ref1.id);

        Referential ref2 = createRef2();
        createEntriesOfRef2(ref2.id);
        CreateInjection(ref1, ref2);
        createCols();*/
    }
}
