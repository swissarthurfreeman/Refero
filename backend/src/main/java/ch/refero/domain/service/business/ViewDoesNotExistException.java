package ch.refero.domain.service.business;

public class ViewDoesNotExistException extends RuntimeException {
  public ViewDoesNotExistException() {
    super("View does not exist.");
  }
}
