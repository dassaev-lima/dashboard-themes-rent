import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemsComponent } from './items.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ItemsComponent }])],
    exports: [RouterModule],
})
export class ItemsRoutingModule {}
