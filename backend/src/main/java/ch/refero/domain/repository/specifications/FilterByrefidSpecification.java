package ch.refero.domain.repository.specifications;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

public class FilterByrefidSpecification<T> {
    public Specification<T> filterColfig(String refid) {
        return (root, query, criteriaBuilder) -> {
            Predicate refidPred = criteriaBuilder.like(
                root.get("refid"), 
                refid
            );
            return criteriaBuilder.and(refidPred);
        };
    }
}
