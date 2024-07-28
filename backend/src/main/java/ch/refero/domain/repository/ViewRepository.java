package ch.refero.domain.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.lang.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ch.refero.domain.model.RefView;


public interface ViewRepository extends JpaRepository<RefView, String>, JpaSpecificationExecutor<RefView> {
    @NonNull List<RefView> findByRefid(@NonNull String refid);
    @NonNull List<RefView> findByRefidAndName(@NonNull String refid, @NonNull String name);
    @NonNull Optional<RefView> findById(@NonNull String id);
}
