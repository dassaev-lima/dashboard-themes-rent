import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/demo/service/client.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    providers: [MessageService],
})
export class ClientsComponent implements OnInit {
    clientDialog: boolean = false;
    deleteClientDialog: boolean = false;
    deleteClientsDialog: boolean = false;

    clients: any[] = [];
    client: any = {};
    selectedClients: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];

    constructor(
        private clientService: ClientService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.clientService.getClients().then((data) => {
            this.clients = data;
        });

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Nome' },
            { field: 'email', header: 'Email' },
        ];
    }

    openNew(): void {
        this.client = {};
        this.submitted = false;
        this.clientDialog = true;
    }

    deleteSelectedClients(): void {
        this.deleteClientsDialog = true;
    }

    editClient(client: any): void {
        this.client = { ...client };
        this.clientDialog = true;
    }

    deleteClient(client: any): void {
        this.deleteClientDialog = true;
        this.client = { ...client };
    }

    confirmDeleteSelected(): void {
        this.deleteClientsDialog = false;
        this.selectedClients.forEach((client) => {
            this.clientService.deleteClient(client.id).then(() => {
                this.clients = this.clients.filter(
                    (c) => !this.selectedClients.includes(c)
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Clientes removidos com sucesso',
                    life: 3000,
                });
            });
        });
        this.selectedClients = [];
    }

    confirmDelete(): void {
        this.deleteClientDialog = false;
        this.clientService.deleteClient(this.client.id).then(() => {
            this.clients = this.clients.filter((c) => c.id !== this.client.id);
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Cliente removido com sucesso',
                life: 3000,
            });
            this.client = {};
        });
    }

    hideDialog(): void {
        this.clientDialog = false;
        this.deleteClientDialog = false;
        this.deleteClientsDialog = false;
        this.submitted = false;
    }

    saveClient(): void {
        this.submitted = true;

        if (this.client.name?.trim() && this.client.email?.trim()) {
            if (this.client.id) {
                this.clientService
                    .updateClient(this.client.id, this.client)
                    .then(() => {
                        const index = this.findIndexById(this.client.id);
                        if (index !== -1) {
                            this.clients[index] = this.client;
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Cliente atualizado com sucesso',
                            life: 3000,
                        });

                        this.clients = [...this.clients];
                        this.clientDialog = false;
                        this.client = {};
                    });
            } else {
                this.clientService.addClient(this.client).then((novoClient) => {
                    this.clients.push(novoClient);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Cliente cadastrado com sucesso',
                        life: 3000,
                    });

                    this.clients = [...this.clients];
                    this.clientDialog = false;
                    this.client = {};
                });
            }
        }
    }

    findIndexById(id: number): number {
        return this.clients.findIndex((c) => c.id === id);
    }

    onGlobalFilter(table: any, event: Event): void {
        const valor = (event.target as HTMLInputElement).value;
        table.filterGlobal(valor, 'contains');
    }
}
