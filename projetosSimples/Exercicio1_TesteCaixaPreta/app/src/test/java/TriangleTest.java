import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TriangleTest {
    private Triangle triangle;

    @BeforeEach
    public void setUp() {
        // Este método é executado antes de cada teste
        triangle = new Triangle(3, 4, 5); // Triângulo retângulo (3, 4, 5)
    }

    @Test
    public void testeGetSideLengths() {
        Assertions.assertEquals("3,4,5", triangle.getSideLengths(), "Deve ser retornado os lados do triangulo");
    }

    @Test
    public void testGetPerimeter() {
        Assertions.assertEquals(12, triangle.getPerimeter(), "deve ser retornado 12 que é o perimetro de triangulo");
    }

    @Test
    public void testGetArea() {
        Assertions.assertEquals(6.0, triangle.getArea(), "deve ser retornado 6.0 que é a area do triangulo");
        triangle.setSideLengths(10, 20, 0);
        Assertions.assertEquals(-1, triangle.getArea());
    }

    @Test
    public void testIsImpossible() {
        Assertions.assertFalse(triangle.isImpossible(), "Deve ser retornado falso uma vez que o triangulo é possível");
        triangle.setSideLengths(20, 0, 10);
        Assertions.assertTrue(triangle.isImpossible(),
                "Deve ser retornado verdadeiro uma vez que o triangulo é impossível");
        triangle.setSideLengths(0, 0, 0);
        Assertions.assertTrue(triangle.isImpossible(),
                "Deve ser retornado verdadeiro uma vez que o triangulo é impossível");
    }

    @Test
    public void testIsRightAngled() {
        Assertions.assertTrue(triangle.isRightAngled(),
                "Deve ser retornado true, uma vez que o triângulo é retângulo e satizfaz o teorema de pitágoras");
        triangle.setSideLengths(1, 2, 3);
        Assertions.assertFalse(triangle.isRightAngled(),
                "Deve ser retornado false, uma vez que o triângulo não é retângulo ");
    }

    @Test
    public void isEquilateral() {
        Assertions.assertFalse(triangle.isEquilateral(),
                "Deve ser retornado false, uma vez que o triângulo não é equilátero ");
        triangle.setSideLengths(5, 5, 5);
        Assertions.assertTrue(triangle.isEquilateral(),
                "Deve ser retornado true, uma vez que o triângulo é equilátero ");
    }

    @Test
    public void testIsIsosceles() {
        Assertions.assertFalse(triangle.isIsosceles(),
                "Deve ser retornado false, uma vez que o triângulo não é isósceles ");
        triangle.setSideLengths(4, 4, 5);
        Assertions.assertTrue(triangle.isIsosceles(), "Deve ser retornado true, uma vez que o triângulo é isósceles ");
        triangle.setSideLengths(9, 3, 3);
        Assertions.assertTrue(triangle.isIsosceles(), "Deve ser retornado true, uma vez que o triângulo é isósceles ");
    }

    @Test
    public void testIsScalene() {
        Assertions.assertTrue(triangle.isScalene(), "Deve ser retornado true, uma vez que o triângulo é escaleno");
        triangle.setSideLengths(1, 3, 1);
        Assertions.assertFalse(triangle.isScalene(),
                "Deve ser retornado false, uma vez que o triângulo não é escaleno");
    }

    @Test
    public void testClassyfy() {
        Assertions.assertEquals("right-angled", triangle.classify());
        triangle.setSideLengths(3, 3, 3);
        Assertions.assertEquals("equilateral", triangle.classify());
        triangle.setSideLengths(3, 3, 6);
        Assertions.assertEquals("isossceles", triangle.classify());
        triangle.setSideLengths(1, 3, 6);
        Assertions.assertEquals("scalene", triangle.classify());
        triangle.setSideLengths(10, 1, -6);
        Assertions.assertEquals("impossible", triangle.classify());
    }
}
