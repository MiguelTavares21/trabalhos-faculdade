package projeto_ed.Exceptions;


/**
 * Exception thrown to indicate that an element is not found in a collection.
 * This exception is typically used in situations where an operation expects to find
 * an element in a collection, but the element is not present.
 *
 */
public class ElementNotFoundException extends RuntimeException {

    /**
     *
     * @param collection the name of the collection where the element was not found
     */
    public ElementNotFoundException(String collection) {
        super("Element not found in " + collection);
    }

}
