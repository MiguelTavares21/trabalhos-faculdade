import javax.swing.*;
import java.awt.*;
import java.awt.Font;


/**
 * Classe que representa uma janela para exibir informações sobre a execução de uma tarefa.
 */
class TaskWindow {
    private JFrame frame;
    private JTextArea textArea;

    /**
     * Construtor da classe TaskWindow.
     *
     * @param taskName   O nome da tarefa para exibir na janela.
     * @param totalTime  O tempo total de execução da tarefa.
     */
    public TaskWindow(String taskName, long totalTime) {
        frame = new JFrame("Execução de Tarefa: " + taskName);
        textArea = new JTextArea();
        textArea.setEditable(false);
        textArea.setFont(new Font("Arial", Font.PLAIN, 14));

        JScrollPane scrollPane = new JScrollPane(textArea);
        scrollPane.setPreferredSize(new Dimension(300, 120));

        frame.setLayout(new BorderLayout());
        frame.add(scrollPane, BorderLayout.CENTER);

        frame.setSize(400, 300);
        frame.setLocationRelativeTo(null); // Centraliza a janela na tela
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
    }

    /**
     * Exibe a janela.
     */
    public void show() {
        SwingUtilities.invokeLater(() -> frame.setVisible(true));
    }

    /**
     * Atualiza o status da tarefa na janela.
     *
     * @param status O status a ser exibido na janela.
     */
    public void updateStatus(String status) {
        appendText(status);
    }

    /**
     * Fecha a janela.
     */
    public void close() {
        SwingUtilities.invokeLater(() -> frame.dispose());
    }

    /**
     * Adiciona texto à área de texto da janela.
     *
     * @param text O texto a ser adicionado.
     */
    public void appendText(String text) {
        SwingUtilities.invokeLater(() -> {
            textArea.append(text + "\n");
            textArea.setCaretPosition(textArea.getDocument().getLength());
        });
    }
}
