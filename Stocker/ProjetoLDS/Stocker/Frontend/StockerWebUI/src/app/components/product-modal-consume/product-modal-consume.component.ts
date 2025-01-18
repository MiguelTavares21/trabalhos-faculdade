import { Component, EventEmitter, Input, NgModule } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Componente responsável pelo modal de consumo de produto.
 */
@Component({
  selector: 'app-product-modal-consume',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-modal-consume.component.html',
  styleUrls: [
    './product-modal-consume.component.css',
    '../product-modal/product-modal.component.css',
    '../product-modal-edit/product-modal-edit.component.css',
  ],
})
export class ProductModalConsumeComponent {
  @Input() product: Product | null = null; // Recebe o produto a ser consumido
  @Output() onSave = new EventEmitter<Product>(); // Evento de salvar a alteração da quantidade
  @Output() onClose = new EventEmitter<void>(); // Evento de fechar o modal

  currentGroupId: number = localStorage.getItem('selectedGroupId')
    ? parseInt(localStorage.getItem('selectedGroupId')!)
    : 0; // ID do grupo selecionado
  consumeProductForm: FormGroup; // Formulário de consumo de produto

  selectedProductId: number = this.product ? this.product.id : 0; // ID do produto selecionado
  selectedUserId: number = localStorage.getItem('selectedUserId')
    ? parseInt(localStorage.getItem('selectedUserId')!)
    : 0; // ID do utilizador selecionado

  /**
   * Controlo da visibilidade do modal de confirmação.
   */
  showConfirmationModal = false;
  showEditModal = false;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    // Inicializa o formulário apenas com o campo de quantidade
    this.consumeProductForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(0)]], // Quantidade obrigatória e >= 0
    });
  }

  /**
   * Método chamado ao inicializar o componente (ngOnInit).
   * Preenche o formulário com a quantidade do produto recebido como entrada, se disponível.
   */
  ngOnInit(): void {
    if (this.product) {
      this.selectedProductId = this.product.id;
      this.consumeProductForm.patchValue({
        quantity: this.product.quantity,
      });
    } else {
      this.closeModal();
    }
  }

  /**
   * Método chamado ao submeter o formulário.
   * Se o formulário for válido, emite o produto com a nova quantidade.
   * Caso contrário, exibe um erro na consola.
   */
  onSubmit(): void {
    if (this.consumeProductForm.valid) {
      if (this.product) {
        const updatedProduct: Product = {
          ...this.product, // Mantém os dados existentes do produto
          quantity: this.consumeProductForm.value.quantity, // Atualiza apenas a quantidade
        };
        // Emite o produto atualizado para o componente pai
        this.onSave.emit(updatedProduct);
        // Fecha o modal após salvar
        this.onClose.emit();
      } else {
        return;
      }
    } else {
      return;
    }
  }

  /**
   * Método chamado para fechar o modal sem salvar alterações.
   */
  closeModal(): void {
    this.onClose.emit();
  }

  /**
   * Método que abre o modal de edição, permitindo ao utilizador alterar a quantidade do produto.
   * @param productId ID do produto que será editado.
   */
  openEditModal(productId: number) {
    if (productId) {
      this.selectedProductId = productId;
      this.showConfirmationModal = false;
      this.showEditModal = true;
    } else {
      throw new Error(
        'ID do produto inválido ou não fornecido ao abrir o modal de edição.'
      );
    }
  }

  /**
   * Método para fechar o modal de edição.
   */
  closeEditModal() {
    this.showEditModal = false;
  }

  /**
   * Método que impede a propagação do evento para outros elementos.
   * Usado para evitar que o clique num botão ou área do modal feche o modal de forma indesejada.
   * @param event Evento do DOM que será propagado.
   */
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
