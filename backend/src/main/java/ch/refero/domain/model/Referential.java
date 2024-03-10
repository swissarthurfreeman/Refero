package ch.refero.domain.model;
import java.util.HashMap;
import com.google.common.collect.TreeBasedTable;

import jakarta.annotation.Resource;

public class Referential {
    public String name;
    public String description;
    
    @Resource
    public TreeBasedTable<String, String, String> table;
    
    @Resource
    public HashMap<String, ColType> columns;
}
