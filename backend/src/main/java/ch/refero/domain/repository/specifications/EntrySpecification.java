package ch.refero.domain.repository.specifications;

import org.springframework.data.jpa.domain.Specification;

import ch.refero.domain.model.Entry;
import jakarta.persistence.criteria.Predicate;

public class EntrySpecification {
    public static Specification<Entry> filterColfig(String ref_id) {
        return (root, query, criteriaBuilder) -> {
            Predicate refIdPred = criteriaBuilder.like(
                root.get("ref_id"), 
                ref_id
            );
            return criteriaBuilder.and(refIdPred);
        };
    }
}
