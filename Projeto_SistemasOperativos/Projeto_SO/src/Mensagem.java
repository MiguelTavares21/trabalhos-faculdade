import java.util.Date;

/**
 * A classe Mensagem representa uma mensagem que pode ser processada em uma thread separada.
 */
public class Mensagem extends Thread {
    private String remetente;
    private String destinatario;
    private String conteudo;
    private Date dataEnvio;

    // Construtor

    /**
     * Construtor que inicializa uma instância de Mensagem com remetente, destinatário e conteúdo.
     *
     * @param remetente    o remetente da mensagem
     * @param destinatario o destinatário da mensagem
     * @param conteudo     o conteúdo da mensagem
     */
    public Mensagem(String remetente, String destinatario, String conteudo) {
        this.remetente = remetente;
        this.destinatario = destinatario;
        this.conteudo = conteudo;
        this.dataEnvio = new Date();
    }

    /**
     * Método run, parte da interface Runnable, que define o comportamento da thread ao ser iniciada.
     * Simula o processamento da mensagem, aguardando 5 segundos.
     */
    @Override
    public void run() {
        System.out.println("Satélite: Processando mensagem de " + remetente);

        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("Satélite: Mensagem processada");
    }

    /**
     * Obtém o remetente da mensagem.
     *
     * @return o remetente da mensagem
     */
    public String getRemetente() {
        return remetente;
    }

    /**
     * Obtém o destinatário da mensagem.
     *
     * @return o destinatário da mensagem
     */
    public String getDestinatario() {
        return destinatario;
    }

    /**
     * Obtém o conteúdo da mensagem.
     *
     * @return o conteúdo da mensagem
     */
    public String getConteudo() {
        return conteudo;
    }

    /**
     * Obtém a data de envio da mensagem.
     *
     * @return a data de envio da mensagem
     */
    public Date getDataEnvio() {
        return dataEnvio;
    }
}
