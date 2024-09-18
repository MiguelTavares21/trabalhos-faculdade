package projeto_ed.Trees;

/**
 * BinaryTreeNode represents a node in a binary tree with a left and
 * right child.
 */
public class BinaryTreeNode<T> {
    protected T element;
    protected BinaryTreeNode<T> left, right;

    /**
     * Creates a new tree node with the specified data.
     *
     * @param obj the element that will become a part of
     *            the new tree node
     */
    protected BinaryTreeNode(T obj) {
        element = obj;
        left = null;
        right = null;
    }

    /**
     * Returns the number of non-null children of this node.
     * This method may be able to be written more efficiently.
     *
     * @return the integer number of non-null children of this node
     */
    public int numChildren() {
        int children = 0;
        if (left != null)
            children = 1 + left.numChildren();
        if (right != null)
            children = children + 1 + right.numChildren();
        return children;
    }

    /**
     * Gets the element stored in this node.
     *
     * @return The element stored in this node.
     */
    public T getElement() {
        return element;
    }

    /**
     * Sets the element stored in this node.
     *
     * @param element The new element to set in this node.
     */
    public void setElement(T element) {
        this.element = element;
    }

    /**
     * Gets the left child of this node.
     *
     * @return The left child of this node.
     */
    public BinaryTreeNode<T> getLeft() {
        return left;
    }

    /**
     * Sets the left child of this node.
     *
     * @param left The new left child for this node.
     */
    public void setLeft(BinaryTreeNode<T> left) {
        this.left = left;
    }

    /**
     * Gets the right child of this node.
     *
     * @return The right child of this node.
     */
    public BinaryTreeNode<T> getRight() {
        return right;
    }

    /**
     * Sets the right child of this node.
     *
     * @param right The new right child for this node.
     */
    public void setRight(BinaryTreeNode<T> right) {
        this.right = right;
    }
}