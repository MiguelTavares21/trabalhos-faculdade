package TreesAVL;

/**
 * AVLTreeNode represents a node in an AVL tree with a left and
 * right child. It maintains the balance factor (height difference)
 * to ensure the AVL property.
 *
 * @param <T> The generic type of elements stored in the node.
 */
public class AVLTreeNode<T> {
    protected T element;
    protected AVLTreeNode<T> left;
    protected AVLTreeNode<T> right;
    protected int height;

    /**
     * Creates a new AVL tree node with the specified data.
     *
     * @param element the element that will become a part of
     *                the new AVL tree node
     */
    public AVLTreeNode(T element) {
        this.element = element;
        this.left = null;
        this.right = null;
        this.height = 0;
    }

    /**
     * Returns the number of non-null children of this node.
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
}