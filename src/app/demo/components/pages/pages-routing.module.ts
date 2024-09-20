import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            /*{
                path: 'crud',
                loadChildren: () =>
                    import('./crud/crud.module').then((m) => m.CrudModule),
            },
            {
                path: 'empty',
                loadChildren: () =>
                    import('./empty/emptydemo.module').then(
                        (m) => m.EmptyDemoModule
                    ),
            },
            {
                path: 'timeline',
                loadChildren: () =>
                    import('./timeline/timelinedemo.module').then(
                        (m) => m.TimelineDemoModule
                    ),
            },*/
            {
                path: 'themes',
                loadChildren: () =>
                    import('./themes/themes.module').then(
                        (m) => m.ThemesModule
                    ),
            },
            {
                path: 'clients',
                loadChildren: () =>
                    import('./clients/clients.module').then(
                        (m) => m.ClientsModule
                    ),
            },
            {
                path: 'items',
                loadChildren: () =>
                    import('./items/items.module').then((m) => m.ItemsModule),
            },
            {
                path: 'rents',
                loadChildren: () =>
                    import('./rents/rents.module').then((m) => m.RentsModule),
            },
            {
                path: 'addresses',
                loadChildren: () =>
                    import('./addresses/addresses.module').then(
                        (m) => m.AddressModule
                    ),
            },

            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
