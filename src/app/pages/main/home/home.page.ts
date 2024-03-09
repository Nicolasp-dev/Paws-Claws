import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/products';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: any[] = [];

  signOut() {
    this.firebaseSvc.signOut();
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  // Get products
  getProducts(): void {
    let path = `users/${this.user().uid}/products`;
    let sub = this.firebaseSvc.getCollection(path).subscribe({
      next: (res) => {
        this.products = res;
        sub.unsubscribe();
      },
    });
  }

  // Add or Update Products
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });

    if (success) this.getProducts();
  }

  async deleteProduct(product: Product): Promise<void> {
    const path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    const imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc
      .deleteDocument(path)
      .then(async (res: any) => {
        this.products = this.products.filter((p) => p.id !== product.id);

        this.utilsSvc.presentToast({
          message: 'Producto eliminado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => loading.dismiss());
  }

  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Si, Eliminar',
          handler: () => {
            this.deleteProduct(product);
          },
        },
      ],
    });
  }
}
