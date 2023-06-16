import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent {
  @Output() ratingSubmitted = new EventEmitter<{ rating: number; comment: string }>();
  @Output() onCloseModal = new EventEmitter();
  starsArray = [1, 2, 3, 4, 5];
  selectedStarIndex = -1;
  comment = '';

  onStarClick(index: number) {
    this.selectedStarIndex = index;
  }

  onSubmit() {
    if (this.selectedStarIndex !== -1) {
      this.ratingSubmitted.emit({ rating: this.selectedStarIndex + 1, comment: this.comment });
    }
    this.closeModal();
  }

  onCancel() {
    this.closeModal();
  }

  private closeModal() {
    this.onCloseModal.emit();
  }
}
