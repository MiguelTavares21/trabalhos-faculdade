package Interfaces;

/**
 * OrderedListADT defines the interface to a binary orderedList.
 *
 */
public interface OrderedListADT<T> extends ListADT<T> {
    /**
     * Adds the specified element to this list at
     * the proper location
     *
     * @param element the element to be added to this list
     */
    void add(T element);
}
