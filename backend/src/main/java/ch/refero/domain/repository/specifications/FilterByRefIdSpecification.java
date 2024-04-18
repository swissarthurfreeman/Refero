package ch.refero.domain.repository.specifications;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

public class FilterByRefIdSpecification<T> {
    public Specification<T> filterColfig(String ref_id) {
        return (root, query, criteriaBuilder) -> {
            Predicate refIdPred = criteriaBuilder.like(
                root.get("ref_id"), 
                ref_id
            );
            return criteriaBuilder.and(refIdPred);
        };
    }
}
