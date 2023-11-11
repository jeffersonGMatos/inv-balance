import { Routes } from '@angular/router';
//import { ScannerComponent } from './scanner/scanner.component';
import { BarcodeScannerComponent } from './barcode-scanner/barcode-scanner.component';

export const routes: Routes = [
  {
    path: "scan",
    component: BarcodeScannerComponent
  }
];
