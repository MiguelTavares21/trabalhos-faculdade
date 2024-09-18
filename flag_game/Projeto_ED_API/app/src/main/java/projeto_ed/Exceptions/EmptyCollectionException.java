package projeto_ed.Exceptions;

/**
 * Exception thrown to indicate that an operation requiring a non-empty collection was
 * performed on an empty collection.
 * This exception is typically used in situations where an operation expects the
 * collection to contain elements, but the collection is found to be empty.
 */
public class EmptyCollectionException extends RuntimeException {
    /**
     *
     * @param collection the name of the collection that is empty
     */
    public EmptyCollectionException(String collection) {
        super("The " + collection + " is empty.");
    }
}

