package ch.refero.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import ch.refero.domain.model.RefView;


public interface ViewRepository extends CrudRepository<RefView, String> {
    List<RefView> findAll();
    Optional<RefView> findById(String id);
}
