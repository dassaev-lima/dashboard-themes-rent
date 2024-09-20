import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RentsComponent } from './rents.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: RentsComponent }])],
    exports: [RouterModule],
})
export class RentsRoutingModule {}
