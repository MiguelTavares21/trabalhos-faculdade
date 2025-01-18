import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Types } from '../../enums/types.enum';
import { Unity } from '../../enums/unity.enum';
import { Product } from '../../models/product';
import { AlertComponent } from '../alert/alert.component';
import { TypeLabels } from '../../utils/typeLabels';

/**
 * Componente responsável pela criação de produtos no modal.
 */
@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css',
})
export class ProductModalComponent {
  currentGroupId: number = localStorage.getItem('selectedGroupId')
    ? parseInt(localStorage.getItem('selectedGroupId')!)
    : 0; // ID do grupo selecionado

  createProductForm!: FormGroup; // Formulário reativo utilizado para criar um novo produto.

  alerts: string[] = []; // Lista de mensagens de alerta
  selectedProduct: Product | null = null; // Produto selecionado para edição

  @Output() onSave = new EventEmitter<any>(); // Evento de guardar o produto
  @Output() onClose = new EventEmitter<void>(); // Evento de fechar o modal
  @Input() product: Product | null = null; // Recebe o produto a ser editado
  @Input() disableQuantity?: boolean; // Define se o campo de quantidade será exibido

  Unity = Unity; // Enum de unidades
  types = Types; // O enum com os valores
  typeLabels = TypeLabels;

  /**
   * Método executado quando o componente detecta mudanças nas entradas (ngOnChanges).
   * Atualiza o formulário com os dados do produto selecionado enquanto a editar.
   */
  ngOnChanges() {
    if (this.selectedProduct) {
      this.createProductForm.patchValue({
        name: this.selectedProduct.name,
        unity: this.selectedProduct.unity,
        ideal_Point: this.selectedProduct.ideal_Point,
        order_Point: this.selectedProduct.order_Point,
        quantity: this.selectedProduct.quantity,
      });
    }
  }

  /**
   * Inicializa o formulário reativo com validações para os campos.
   */
  ngOnInit(): void {
    this.createProductForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      quantity: new FormControl(0, [Validators.min(0)]),
      unity: new FormControl('', [Validators.required]),
      order_Point: new FormControl(0, [Validators.min(0)]),
      ideal_Point: new FormControl(0, [Validators.min(0)]),
      type: new FormControl('', [Validators.required]),
    });

    if (this.disableQuantity !== undefined) {
      // Desativa ou ativa o campo 'quantity' dinamicamente
      if (this.disableQuantity) {
        this.createProductForm.get('quantity')?.disable();
      } else {
        this.createProductForm.get('quantity')?.enable();
      }
    }
  }

  /**
   * Método chamado ao submeter o formulário. Emite o produto para ser guardado (criação ou edição)
   * e fecha o modal.
   */
  onSubmit(): void {
    if (this.createProductForm.valid) {
      // Se estivermos editando, usamos o produto selecionado (selectedProduct)
      let product: Product;
      if (this.selectedProduct) {
        // Editando um produto existente
        product = {
          ...this.selectedProduct, // Mantém os dados existentes
          ...this.createProductForm.value, // Atualiza com os novos valores do formulário
          group_Id: this.currentGroupId,
        };
      } else {
        // Criando um novo produto
        product = {
          ...this.createProductForm.value, // Utiliza os valores do formulário
          group_Id: this.currentGroupId, // Certificando-se de adicionar o group_Id
        };
      }
      // Emite o produto para ser salvo
      this.onSave.emit(product);

      // Fecha o modal após salvar
      this.onClose.emit();
      this.addAlert('Produto criado com sucesso.');
    } else {
      console.error('Formulário inválido!');
    }
  }

  /**
   * Método responsável por fechar o modal e resetar o formulário.
   */
  closeModal() {
    this.createProductForm.reset();
    this.onClose.emit();
  }

  /**
   * Adiciona um alerta à lista de alertas para ser exibido no componente.
   * O alerta será removido após 2 segundos.
   *
   * @param message A mensagem do alerta.
   */
  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
    setTimeout(() => {
      this.removeAlert(message);
    }, 2000);
  }

  /**
   * Remove um alerta da lista de alertas.
   * @param alert A mensagem do alerta a ser removida.
   */
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }
}
