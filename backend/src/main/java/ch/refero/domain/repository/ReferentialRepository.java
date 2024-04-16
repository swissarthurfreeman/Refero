package ch.refero.domain.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ch.refero.domain.model.Referential;

public interface ReferentialRepository extends CrudRepository<Referential, Long> {
    List<Referential> findAll();

}
