import javax.swing.JFrame;
import javax.swing.JLabel;
import java.text.SimpleDateFormat;

/**
 * A classe MensagemWindow representa uma janela que exibe informações de uma Mensagem.
 * Pode ser executada em uma thread separada para exibir as informações por um período de tempo.
 */
public class MensagemWindow extends Thread {
    private Mensagem mensagem;
    private int tempo;

    /**
     * Construtor que inicializa uma instância de MensagemWindow com uma mensagem e um tempo de exibição.
     *
     * @param mensagem a mensagem cujas informações serão exibidas na janela
     * @param tempo    o tempo em milissegundos que a janela será exibida
     */
    public MensagemWindow(Mensagem mensagem, int tempo) {
        this.mensagem = mensagem;
        this.tempo = tempo;
    }

    /**
     * Método run, parte da interface Runnable, que define o comportamento da thread ao ser iniciada.
     * Cria e exibe uma janela com as informações da mensagem por um período de tempo.
     */
    @Override
    public void run() {
        JFrame frame = new JFrame("Informações da Mensagem");
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

        JLabel labelRemetente = new JLabel("Remetente: " + mensagem.getRemetente());
        JLabel labelDestinatario = new JLabel("Destinatário: " + mensagem.getDestinatario());
        JLabel labelConteudo = new JLabel("Conteúdo: " + mensagem.getConteudo());
        JLabel labelDataEnvio = new JLabel("Data de Envio: " + dateFormat.format(mensagem.getDataEnvio()));

        frame.setLayout(null);
        labelRemetente.setBounds(10, 10, 300, 20);
        labelDestinatario.setBounds(10, 30, 300, 20);
        labelConteudo.setBounds(10, 50, 300, 20);
        labelDataEnvio.setBounds(10, 70, 300, 20);

        frame.add(labelRemetente);
        frame.add(labelDestinatario);
        frame.add(labelConteudo);
        frame.add(labelDataEnvio);

        frame.setSize(400, 150);
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
