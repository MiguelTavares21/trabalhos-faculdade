import javax.swing.JFrame;
import javax.swing.JLabel;

/**
 * A classe Janela representa uma janela Swing que exibe informações sobre a porcentagem de memória.
 * Implementa a interface Runnable para ser executada em uma thread separada.
 */
public class JanelaMemoria implements Runnable {
    private String mensagem;
    private int tempo;
    private double percentagemMemoria;

    /**
     * Construtor da classe Janela.
     *
     * @param mensagem           a mensagem a ser exibida na janela
     * @param tempo              o tempo em milissegundos que a janela será exibida
     * @param percentagemMemoria a porcentagem de memória a ser exibida na janela
     */
    public JanelaMemoria(String mensagem, int tempo, double percentagemMemoria) {
        this.mensagem = mensagem;
        this.tempo = tempo;
        this.percentagemMemoria = percentagemMemoria;
    }


    /**
     * Método run, parte da interface Runnable, que define o comportamento da thread ao ser iniciada.
     * Cria uma janela Swing com informações sobre a porcentagem de memória e a exibe por um período de tempo.
     */
    public void run() {
        JFrame frame = new JFrame("Porcentagem de Memória");
        JLabel labelMensagem = new JLabel(mensagem);
        JLabel labelPorcentagem = new JLabel("Porcentagem de Memória: " + percentagemMemoria + "%");
        JLabel labelMensagem2 = new JLabel("Tem disponível : " + (100 - percentagemMemoria) + "% de memoria");

        frame.setLayout(null);
        labelMensagem.setBounds(10, 10, 300, 20);
        labelPorcentagem.setBounds(10, 30, 300, 20);
        labelMensagem2.setBounds(10, 50, 300, 20);

        frame.add(labelMensagem);
        frame.add(labelPorcentagem);
        frame.add(labelMensagem2);

        frame.setSize(300, 150);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

        try {
            Thread.sleep(tempo);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        frame.dispose();
    }
}
