package projeto_ed.Heaps;

import projeto_ed.Trees.BinaryTreeNode;

/**
 * HeapNode represents a node in a heap data structure.
 *
 * @param <T> the type of elements stored in the heap node
 */
public class HeapNode<T> extends BinaryTreeNode<T> {
    protected HeapNode<T> parent;

    /**
     * Creates a new heap node with the specified data.
     *
     * @param obj the data to be contained within
     *            the new heap nodes
     */
    HeapNode(T obj) {
        super(obj);
        parent = null;
    }
}