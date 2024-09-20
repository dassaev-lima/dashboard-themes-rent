import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/demo/service/theme.service';
import { ItemService } from 'src/app/demo/service/item.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-themes',
    templateUrl: './themes.component.html',
    providers: [MessageService, ItemService],
})
export class ThemesComponent implements OnInit {
    themeDialog: boolean = false;
    deleteThemeDialog: boolean = false;
    deleteThemesDialog: boolean = false;

    themes: any[] = [];
    items: any[] = [];
    theme: any = {};
    selectedThemes: any[] = [];
    selectedItems: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];

    constructor(
        private themeService: ThemeService,
        private itemService: ItemService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Nome' },
            { field: 'color', header: 'Cor' },
            { field: 'price', header: 'Preço' },
        ];
        this.loadThemes();
        this.loadItems();
    }

    loadThemes() {
        this.themeService.getThemes().then((data) => {
            this.themes = data;
        });
    }

    loadItems(): void {
        this.itemService.getItems().then(
            (data) => {
                this.items = data;
            },
            (error) => {
                console.error('Erro ao carregar itens', error);
            }
        );
    }

    openNew() {
        this.theme = {};
        this.submitted = false;
        this.themeDialog = true;
    }

    editTheme(theme: any) {
        this.theme = { ...theme };
        this.themeDialog = true;
    }

    deleteTheme(theme: any) {
        this.theme = { ...theme };
        this.deleteThemeDialog = true;
    }

    confirmDelete() {
        this.themeService.deleteTheme(this.theme.id).then(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Tema excluído com sucesso',
                life: 3000,
            });
            this.loadThemes();
            this.deleteThemeDialog = false;
            this.theme = {};
        });
    }

    deleteSelectedThemes() {
        this.deleteThemesDialog = true;
    }

    confirmDeleteSelected() {
        this.themeService.deleteThemes(this.selectedThemes).then(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Temas excluídos com sucesso',
                life: 3000,
            });
            this.loadThemes();
            this.deleteThemesDialog = false;
            this.selectedThemes = [];
        });
    }

    hideDialog() {
        this.themeDialog = false;
        this.submitted = false;
    }

    saveTheme() {
        this.submitted = true;

        if (this.theme.name.trim()) {
            if (this.theme.id) {
                this.themeService
                    .updateTheme(this.theme.id, this.theme)
                    .then(() => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Tema atualizado com sucesso',
                            life: 3000,
                        });
                        this.loadThemes();
                        this.themeDialog = false;
                        this.theme = {};
                    });
            } else {
                this.themeService.addTheme(this.theme).then(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Tema criado com sucesso',
                        life: 3000,
                    });
                    this.loadThemes();
                    this.themeDialog = false;
                    this.theme = {};
                });
            }
        }
    }
}
