import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent {
  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    image: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  async submit(): Promise<void> {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // this.firebaseSvc
      //   .signUp(this.form.value)
      //   .then(async (res: any) => {
      //     await this.firebaseSvc.updateUser(this.form.value.name!!);
      //     let uid = res.user.uid;
      //   })
      //   .catch((error) => {
      //     this.utilsSvc.presentToast({
      //       message: error.message,
      //       duration: 2500,
      //       color: 'primary',
      //       position: 'middle',
      //       icon: 'alert-circle-outline',
      //     });
      //   })
      //   .finally(() => loading.dismiss());
    }
  }

  // TAKE/SELECT IMAGE
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl!!);
  }
}
