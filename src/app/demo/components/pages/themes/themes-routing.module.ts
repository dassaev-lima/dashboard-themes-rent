import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemesComponent } from './themes.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: ThemesComponent }]),
    ],
    exports: [RouterModule],
})
export class ThemesRoutingModule {}
