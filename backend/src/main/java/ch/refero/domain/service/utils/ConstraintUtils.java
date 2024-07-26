package ch.refero.domain.service.utils;

import ch.refero.domain.model.ColType;
import ch.refero.domain.model.Colfig;
import ch.refero.domain.model.Entry;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.repository.ReferentialRepository;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConstraintUtils {

  Logger logger = LoggerFactory.getLogger(ConstraintUtils.class);

  @Autowired
  private EntryRepository entryRepo;

  @Autowired
  private ColfigRepository colfigRepo;

  @Autowired
  private ReferentialRepository refRepo;


  /**
   * Check composed BK Unicity constraint is valid after adding an Entry to the referential.
   *
   * @param entry the entry to be added to the referential.
   */
  public void CheckBkUnicityWhenUpdatingOrAddingAn(Entry entry, Map<String, String> errorMap) {

    var entries = entryRepo.findByRefid(entry.refid);
    var colfigs = colfigRepo.findByRefidAndColtype(entry.refid, ColType.BK);
    logger.info("Found # of BK colfigs for ref :" + String.valueOf(colfigs.size()));

    String entryBkSlice = getBkSliceOf(entry, colfigs);
    Set<String> bkSlices = new HashSet<>();

    for (var e : entries) {
      if (!e.id.equals(entry.id)) {
        bkSlices.add(getBkSliceOf(e, colfigs));
      }
    }

    logger.info(bkSlices.toString());

    if (bkSlices.contains(entryBkSlice)) {
      for (var c : colfigs) {
        errorMap.put(c.id, "BK already present");
      }
    }
  }

  /**
   * Check composed BK unicity constraint is valid after adding or updating a column to the
   * referential.
   *
   * @param colfig the column to update or add to the referential.
   */
  public void CheckBkUnicityWhenUpdatingOrAddingA(Colfig colfig, Map<String, String> errorMap) {
    var entries = entryRepo.findByRefid(colfig.refid);
    // get all colfigs which are BKs, belong to the ref but are not the parameter colfig.
    var colfigs = colfigRepo.findByRefidAndColtypeAndIdNot(colfig.refid, ColType.BK, colfig.id);
    colfigs.add(colfig);

    Set<String> bkSlices = new HashSet<>();
    for (var e : entries) {
      String bkSlice = getBkSliceOf(e, colfigs);
      if (bkSlices.contains(bkSlice)) {
        errorMap.put("coltype",
            "Referential contains entries with duplicate BK values for this column.");
        return;
      }
      bkSlices.add(bkSlice);
    }
  }

  /**
   * Check entry's date field is valid with respect to colfig's dateFormat property.
   *
   * @param entry the entry to test.
   * @throws DateTimeParseException if entry's date field syntax is invalid.
   */
  public void CheckDateFormatConstraintOn(Entry entry, Map<String, String> errorMap) {
    List<Colfig> colfigs = colfigRepo.findByRefidAndDateformatNotNull(entry.refid);

    for (var col : colfigs) {
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern(col.dateformat);
      if (!col.required && entry.fields.get(col.id)
          == null) // if value isn't provided and col is not required, continue.
      {
        continue;
      }

      try {
        LocalDate.parse(entry.fields.get(col.id),
            formatter); // TODO : if colfig is not required and value is null, this will throw !
      } catch (DateTimeParseException e) {
        errorMap.put(col.id, "Invalid date format");
      }
    }
  }

  /**
   * Check if Colfig's dateFormat is respected by entries of referential.
   *
   * @param colfig the colfig with a non null dateFormat.
   * @throws IllegalArgumentException if colfig dateFormat syntax is invalid
   * @throws DateTimeParseException   if an entry's date field syntax is invalid.
   */
  public void CheckDateFormatConstraintOf(Colfig colfig, Map<String, String> errorMap) {
    var entries = entryRepo.findByRefid(colfig.refid);

    for (var e : entries) {
      DateTimeFormatter formatter;

      try {
        formatter = DateTimeFormatter.ofPattern(colfig.dateformat);
      } catch (IllegalArgumentException ex) {
        errorMap.put("dateformat", "Invalid date format");
        return;
      }
      // column will already be marked as error if it was required, if a value was provided check it
      // not required means it can be null, but if a value is given then it has to be a correct format.
      if (e.fields.get(colfig.id) != null && !e.fields.get(colfig.id)
          .isBlank()) {                            // TODO : validate this is correct behavior
        try {
          LocalDate.parse(e.fields.get(colfig.id), formatter);
        } catch (DateTimeParseException ex) {
          errorMap.put("dateformat",
              "Referential contains entries with incorrectly formatted values for that column.");
          return;
        }
      }
    }
  }

  /**
   * Check if colfig marked as required has a non-blank value in entry.
   *
   * @param entry the entry with said colfig in its fields map.
   */
  public void CheckRequiredConstraintOn(Entry entry, Map<String, String> errorMap) {
    var colfigs = colfigRepo.findByRefidAndRequired(entry.refid, true);
    logger.info("Found # of required columns : " + String.valueOf(colfigs.size()));
    for (var col : colfigs) {
      if (entry.fields.get(col.id) == null || entry.fields.get(col.id).isBlank()) {
        errorMap.put(col.id, "missing required value");
      }
    }
  }

  /**
   * Check if all entries of referential have a value for colfig.
   *
   * @param colfig marked as required.
   */
  public void CheckRequiredConstraintOf(Colfig colfig, Map<String, String> errorMap) {
    var entries = entryRepo.findByRefid(colfig.refid);

    for (var e : entries) // java lazy checks, first check prevents error
    {
      if (e.fields.get(colfig.id) == null || e.fields.get(colfig.id).isBlank()) {
        errorMap.put("required", "Referential has entries with missing values for this column.");
      }
    }
  }

  /**
   * Given an entry with columns (c1 c2 c3 c4) and values (a  b  c  d) if c1 and c4 form a composed
   * BK, return the string 'ad'.
   */
  public String getBkSliceOf(Entry entry, List<Colfig> bkColfigs) {
    var newEntryBkSlice = "";
    for (var bkColfig : bkColfigs) {
      newEntryBkSlice += entry.fields.get(bkColfig.id);
    }
    return newEntryBkSlice;
  }

  public void CheckFkValidityOf(Colfig colfig, Map<String, String> errorMap) {
    if (colfig.pointedrefid == null) {
      errorMap.put("pointedrefid", "value is required");
    } else {
      var ref = refRepo.findById(colfig.pointedrefid);
      if (ref.isEmpty()) {
        errorMap.put("pointedrefid", "invalid referential id");
      } else {
        if (colfig.pointedrefcolid == null) {
          errorMap.put("pointedrefcolid", "value is required");
        } else {
          if (colfig.pointedrefcolid.equals("PK")) {
            // TODO :deal with pointing on PK case here.
          } else {
            // TODO : make sure it's not possible to point to a multiple value BK
            var bkColfigs = colfigRepo.findByRefidAndColtype(colfig.pointedrefid, ColType.BK);
            if (bkColfigs.size() > 1) {
              errorMap.put("pointedrefcolid", "cannot point to anything else than BK with ref with multiple columns");
            } else {
              var pointedColfig = colfigRepo.findById(colfig.pointedrefcolid);
              if (pointedColfig.isEmpty()) {
                errorMap.put("pointedrefcolid", "invalid colfig id");
              } else {
                if (!pointedColfig.get().getColtype().equals(ColType.BK)) {
                  errorMap.put("pointedrefcolid", "cannot point to non BK column");
                } else {
                  var entries = entryRepo.findByRefid(colfig.refid);
                  var foreignEntries = entryRepo.findByRefid(colfig.pointedrefid);

                  Set<String> foreignBkValues = new HashSet<>();
                  for (var fe : foreignEntries) {
                    foreignBkValues.add(fe.fields.get(colfig.pointedrefcolid));
                  }

                  for (var e : entries) {
                    String fkValue = e.fields.get(colfig.id);
                    if (fkValue == null) {
                      continue;
                    }

                    if (!foreignBkValues.contains(fkValue)) {
                      errorMap.put("pointedrefcolid",
                          "Referential contains entries with invalid foreign key values.");
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // TODO : cycle over all entries, if colfig is not required, assert that for the non null
    // ones the provided value is a valid FK.
    // TODO : validate syntax when we'll have decided on how to implement it.
  }
}
