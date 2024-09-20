import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddressesComponent } from './addresses.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: AddressesComponent }]),
    ],
    exports: [RouterModule],
})
export class AddressRoutingModule {}
