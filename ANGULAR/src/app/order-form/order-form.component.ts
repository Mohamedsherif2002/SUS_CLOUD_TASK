import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OrderService, Order } from '../order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private toastr: ToastrService
  ) {
    this.orderForm = this.fb.group({
      orderDate: ['', Validators.required],
      customerName: ['', Validators.required],
      totalAmount: [{ value: '', disabled: true }], // Disable the total amount field
      orderDetails: this.fb.array([])
    });
  }

  ngOnInit() {
    // Subscribe to value changes in the order details form array
    this.orderDetails.valueChanges.subscribe(() => {
      this.updateTotalAmount();
    });
  }

  get orderDetails(): FormArray {
    return this.orderForm.get('orderDetails') as FormArray;
  }

  addOrderDetail() {
    const detailGroup = this.fb.group({
      productName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      unitPrice: ['', [Validators.required, Validators.min(0.01)]]
    });
    this.orderDetails.push(detailGroup);
  }

  removeOrderDetail(index: number) {
    this.orderDetails.removeAt(index);
    this.updateTotalAmount(); // Recalculate total amount when removing an item
  }

  updateTotalAmount() {
    const totalAmount = this.orderDetails.controls.reduce((total, control) => {
      const quantity = control.get('quantity')?.value || 0;
      const unitPrice = control.get('unitPrice')?.value || 0;
      return total + (quantity * unitPrice);
    }, 0);

    // Update the total amount in the form control
    this.orderForm.get('totalAmount')?.setValue(totalAmount, { emitEvent: false });
  }

  onSubmit() {
  if (this.orderForm.valid) {
    const order: Order = {
      orderDate: this.orderForm.value.orderDate,
      customerName: this.orderForm.value.customerName,
      totalAmount: this.orderForm.get('totalAmount')?.value, // Get totalAmount explicitly
      orderDetails: this.orderForm.value.orderDetails,
    };

    console.log('Order to submit:', order); // Ensure totalAmount is included

    this.orderService.saveOrder(order).subscribe(
      response => this.toastr.success('Order saved successfully'),
      error => this.toastr.error('Error saving order')
    );
  }
}

}
