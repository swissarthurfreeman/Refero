package ch.refero.domain.repository.specifications;

import org.springframework.data.jpa.domain.Specification;

import ch.refero.domain.model.Colfig;
import jakarta.persistence.criteria.Predicate;

public class ColfigSpecification {
    public static Specification<Colfig> filterColfig(String ref_id) {
        return (root, query, criteriaBuilder) -> {
            Predicate refIdPred = criteriaBuilder.like(
                root.get("ref_id"), 
                ref_id
            );
            return criteriaBuilder.and(refIdPred);
        };
    }
}
