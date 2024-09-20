import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../service/item.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    providers: [MessageService],
})
export class ItemsComponent implements OnInit {
    itemDialog: boolean = false;
    deleteItemDialog: boolean = false;
    deleteItemsDialog: boolean = false;

    items: any[] = [];
    item: any = {};
    selectedItems: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];

    constructor(
        private itemService: ItemService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.itemService.getItems().then((data) => {
            this.items = data;
        });

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Nome' },
            { field: 'description', header: 'Descrição' },
        ];
    }

    openNew(): void {
        this.item = {};
        this.submitted = false;
        this.itemDialog = true;
    }

    deleteSelectedItems(): void {
        this.deleteItemsDialog = true;
    }

    editItem(item: any): void {
        this.item = { ...item };
        this.itemDialog = true;
    }

    deleteItem(item: any): void {
        this.deleteItemDialog = true;
        this.item = { ...item };
    }

    confirmDeleteSelected(): void {
        this.deleteItemsDialog = false;
        this.selectedItems.forEach((item) => {
            this.itemService.deleteItem(item.id).then(() => {
                this.items = this.items.filter(
                    (i) => !this.selectedItems.includes(i)
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Itens removidos com sucesso',
                    life: 3000,
                });
            });
        });
        this.selectedItems = [];
    }

    confirmDelete(): void {
        this.deleteItemDialog = false;
        this.itemService.deleteItem(this.item.id).then(() => {
            this.items = this.items.filter((i) => i.id !== this.item.id);
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Item removido com sucesso',
                life: 3000,
            });
            this.item = {};
        });
    }

    hideDialog(): void {
        this.itemDialog = false;
        this.deleteItemDialog = false;
        this.deleteItemsDialog = false;
        this.submitted = false;
    }

    saveItem(): void {
        this.submitted = true;

        if (this.item.name?.trim() && this.item.description?.trim()) {
            if (this.item.id) {
                this.itemService
                    .updateItem(this.item.id, this.item)
                    .then(() => {
                        const index = this.findIndexById(this.item.id);
                        if (index !== -1) {
                            this.items[index] = this.item;
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Item atualizado com sucesso',
                            life: 3000,
                        });

                        this.items = [...this.items];
                        this.itemDialog = false;
                        this.item = {};
                    });
            } else {
                this.itemService.addItem(this.item).then((novoItem) => {
                    this.items.push(novoItem);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Item cadastrado com sucesso',
                        life: 3000,
                    });

                    this.items = [...this.items];
                    this.itemDialog = false;
                    this.item = {};
                });
            }
        }
    }

    findIndexById(id: number): number {
        return this.items.findIndex((i) => i.id === id);
    }

    onGlobalFilter(table: any, event: Event): void {
        const valor = (event.target as HTMLInputElement).value;
        table.filterGlobal(valor, 'contains');
    }
}
