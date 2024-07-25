package ch.refero.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;

import ch.refero.domain.model.ColType;
import ch.refero.domain.model.Colfig;


// see https://blog.stackademic.com/implement-your-search-filter-api-with-spring-data-jpa-specifications-365f2089ef1c

public interface ColfigRepository extends JpaRepository<Colfig, String>, JpaSpecificationExecutor<Colfig> {
    @NonNull Optional<Colfig> findById(@NonNull String id);
    @NonNull List<Colfig> findAll(@NonNull Specification<Colfig> spec);
    @NonNull List<Colfig> findByRefid(@NonNull String refid);
    @NonNull List<Colfig> findByRefidAndColtype(@NonNull String refid, @NonNull ColType coltype);
    @NonNull List<Colfig> findByRefidAndColtypeAndIdNot(@NonNull String refid, @NonNull ColType coltype, @NonNull String id);
    @NonNull List<Colfig> findByRefidAndDateformatNotNull(@NonNull String refid);
    @NonNull List<Colfig> findByRefidAndRequired(@NonNull String refid, boolean required);
}
