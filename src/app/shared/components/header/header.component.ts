import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title!: string;
  @Input() backBtn!: string;
  @Input() isModal!: boolean;

  utilsSvc = inject(UtilsService);

  dismissModal() {
    this.utilsSvc.dismissModal();
  }
}
