package ch.refero.domain.service.utils;

import ch.refero.domain.error.EntryPutErrorType;
import ch.refero.domain.model.ColType;
import ch.refero.domain.model.Colfig;
import ch.refero.domain.model.Entry;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.repository.ReferentialRepository;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
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
  public Optional<Entry> CheckBkUnicityWhenUpdatingOrAddingAn(Entry entry,
      Map<String, Object> errorMap) {
    var entries = entryRepo.findByRefid(entry.refid);
    var colfigs = colfigRepo.findByRefidAndColtype(entry.refid, ColType.BK);
    if (colfigs.size() > 0) {
      logger.info("Found # of BK colfigs for ref :" + String.valueOf(colfigs.size()));

      String entryBkSlice = getBkSliceOf(entry, colfigs);
      List<String> bkSlices = new ArrayList<>();

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
        errorMap.put("errType", EntryPutErrorType.DuplicateBk);
        return Optional.of(entries.get(bkSlices.indexOf(entryBkSlice)));
      }
    }
    return Optional.empty();
  }

  /**
   * Check composed BK unicity constraint is valid after adding or updating a column to the
   * referential.
   *
   * @param colfig the column to update or add to the referential.
   */
  public void CheckBkUnicityWhenUpdatingOrAddingA(Colfig colfig, Map<String, Object> errorMap) {
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
  public void CheckDateFormatConstraintOn(Entry entry, Map<String, Object> errorMap) {
    List<Colfig> colfigs = colfigRepo.findByRefidAndDateformatNotNull(entry.refid);

    for (var col : colfigs) {
      // if this isn't a date column or value isn't provided and col is not required, continue.
      if (col.dateformat == null || col.dateformat.isBlank() || !col.required && (
          entry.fields.get(col.id) == null || entry.fields.get(col.id).isBlank())) {
        continue;
      }

      DateTimeFormatter formatter = DateTimeFormatter.ofPattern(col.dateformat);
      try {
        // TODO : if colfig is not required and value is null, this will throw !
        LocalDate.parse(entry.fields.get(col.id), formatter);
      } catch (DateTimeParseException e) {
        errorMap.put(col.id, "Invalid date format");
        errorMap.put("errType", EntryPutErrorType.InvalidDateFormat);
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
  public void CheckDateFormatConstraintOf(Colfig colfig, Map<String, Object> errorMap) {
    DateTimeFormatter formatter;

    try {
      formatter = DateTimeFormatter.ofPattern(colfig.dateformat);
    } catch (IllegalArgumentException ex) {
      errorMap.put("dateformat", "Invalid date format");
      return;
    }

    var entries = entryRepo.findByRefid(colfig.refid);

    for (var e : entries) {
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
  public void CheckRequiredConstraintOn(Entry entry, Map<String, Object> errorMap) {
    var colfigs = colfigRepo.findByRefidAndRequired(entry.refid, true);
    logger.info("Found # of required columns : " + String.valueOf(colfigs.size()));
    for (var col : colfigs) {
      if (entry.fields.get(col.id) == null || entry.fields.get(col.id).isBlank()) {
        errorMap.put(col.id, "missing required value");
        errorMap.put("errType", EntryPutErrorType.RequiredColumnMissing);
      }
    }
  }

  /**
   * Check if all entries of referential have a value for colfig.
   *
   * @param colfig marked as required.
   */
  public void CheckRequiredConstraintOf(Colfig colfig, Map<String, Object> errorMap) {
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

  /***
   * Check basic properties of the FK configuration.
   * 1. The pointedrefid must be valid
   * 2. The pointedrefcolid is either the string '0' or the id of a colfig marked as BK.
   * 3. If pointedrefcolid is an id, the pointed colfig must be a BK
   * 4. If pointedrefcolid the pointed ref cannot have a composed BK.
   * 5. The pointedrefcollabelid must be valid.
   * @param colfig the column configured as a foreign key
   * @param errorMap the error map containing all the things
   */
  private void CheckFkConfigValidityOf(Colfig colfig, Map<String, Object> errorMap) {
    if (colfig.pointedrefid == null) {
      errorMap.put("pointedrefid", "value is required");
      return;
    }

    var ref = refRepo.findById(colfig.pointedrefid);
    if (ref.isEmpty()) {
      errorMap.put("pointedrefid", "invalid referential id");
      return;
    }

    if (colfig.pointedrefcolid == null) {
      errorMap.put("pointedrefcolid", "value is required");
      return;
    }

    if (colfig.pointedrefcollabelid == null) {
      errorMap.put("pointedrefcollabelid", "value is required");
      return;
    }

    var pointedRefColLabel = colfigRepo.findById(colfig.pointedrefcollabelid);
    if (pointedRefColLabel.isEmpty()) {
      errorMap.put("pointedrefcollabelid", "invalid colfig id");
      return;
    }

    // if we're not pointing towards the PK, make sure pointed column exists
    if (!colfig.pointedrefcolid.equals("PK")) {
      var pointedColfig = colfigRepo.findById(colfig.pointedrefcolid);
      if (pointedColfig.isEmpty()) {
        errorMap.put("pointedrefcolid", "invalid colfig id");
        return;
      }

      if (!pointedColfig.get().getRefid().equals(colfig.pointedrefid)) {
        errorMap.put("pointedrefcolid", "pointed colfig does not belong to pointedref");
      }

      if (pointedColfig.get().getColtype().equals(ColType.BK)) {
        // make sure pointed ref doesn't have a composed BK
        var bkColfigs = colfigRepo.findByRefidAndColtype(colfig.pointedrefid, ColType.BK);
        if (bkColfigs.size() > 1) {
          errorMap.put("pointedrefcolid", "cannot point to composed BK, use PK instead.");
          return;
        }
      } else {
        errorMap.put("pointedrefcolid", "cannot point to non BK column");
        return;
      }
    }
  }

  // TODO : merge function with CheckEntriesHaveValidFkValuesWhenPointedColIsBk, do if else.
  public void CheckEntriesHaveValidFkValuesWhenPointedColIsPk(Colfig colfig,
      Map<String, Object> errorMap) {
    var entries = entryRepo.findByRefid(colfig.refid);
    var foreignEntries = entryRepo.findByRefid(colfig.pointedrefid);

    Set<String> foreignPkValues = new HashSet<>();
    for (var fe : foreignEntries) {
      foreignPkValues.add(fe.id);   // build list of foreign BKs
    }

    for (var e : entries) {
      String fkValue = e.fields.get(colfig.id);
      if (fkValue == null) {
        continue;
      }

      if (!foreignPkValues.contains(fkValue)) {
        errorMap.put("pointedrefcolid",
            "Referential contains entries with invalid FK (foreign PK) values.");
      }
    }
  }

  public void CheckEntriesHaveValidFkValuesWhenPointedColIsBk(Colfig colfig,
      Map<String, Object> errorMap) {
    // check FK values of entries are either valid or null.
    var entries = entryRepo.findByRefid(colfig.refid);
    var foreignEntries = entryRepo.findByRefid(colfig.pointedrefid);

    Set<String> foreignBkValues = new HashSet<>();
    for (var fe : foreignEntries) {
      foreignBkValues.add(fe.fields.get(colfig.pointedrefcolid));   // build list of foreign BKs
    }

    for (var e : entries) {
      String fkValue = e.fields.get(colfig.id);
      if (fkValue == null) {
        continue;
      }

      if (!foreignBkValues.contains(fkValue)) {
        errorMap.put("pointedrefcolid",
            "Referential contains entries with invalid FK (foreign BK) values.");
        return;
      }
    }
  }

  public void CheckFkValidityOf(Colfig colfig, Map<String, Object> errorMap) {
    CheckFkConfigValidityOf(colfig, errorMap);

    if (colfig.pointedrefcolid.equals("PK")) {
      CheckEntriesHaveValidFkValuesWhenPointedColIsPk(colfig, errorMap);
    } else {
      CheckEntriesHaveValidFkValuesWhenPointedColIsBk(colfig, errorMap);
    }

    // TODO : validate foreign col label syntax when we'll have decided on how to implement it.
  }

  // TODO : check validity of foreign key field when adding an entry.
}
