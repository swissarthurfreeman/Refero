package ch.refero.domain.service.business;

public class EntryIsPointedToByOtherRefFkException extends RuntimeException {

  public EntryIsPointedToByOtherRefFkException(String message) {
    super(message);
  }
}
