import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Componente responsável por exibir as mensagens de alerta.
 * Permite que o utilizador remova alertas individualmente.
 */
@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  /**
   * Lista de mensagens de alerta a serem exibidas.
   */
  @Input() alerts!: string[];

  /**
   * Evento emitido quando um alerta é fechado.
   * O evento envia o texto do alerta removido.
   */
  @Output() alertClosed = new EventEmitter<string>();

  /**
   * Método chamado ao remover um alerta.
   * Emite o evento `alertClosed` com o texto do alerta removido.
   *
   * @param alert Texto do alerta a ser removido.
   */
  onRemoveAlert(alert: string) {
    this.alertClosed.emit(alert);
  }
}
