package ch.refero.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import ch.refero.domain.model.Colfig;

// see https://blog.stackademic.com/implement-your-search-filter-api-with-spring-data-jpa-specifications-365f2089ef1c

public interface ColfigRepository extends JpaRepository<Colfig, String>, JpaSpecificationExecutor<Colfig> {
    //List<Colfig> findAll();
    Optional<Colfig> findById(String id);

    List<Colfig> findAll(Specification<Colfig> spec);
}
