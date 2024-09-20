import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../service/client.service'; // Ajuste o caminho conforme necessário

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
    clientDialog: boolean = false;
    deleteClientDialog: boolean = false;
    deleteClientsDialog: boolean = false;

    client: any = {};
    selectedClients: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];

    clients: any[] = [];
    selectedClient: any = {};
    isEditing = false;

    constructor(private ClientService: ClientService) {}

    ngOnInit(): void {
        this.getClients();
    }

    getClients(): void {
        this.ClientService.getClients().then((data) => {
            this.clients = data;
        });
    }

    addClient(): void {
        this.ClientService.addClient(this.selectedClient).then((client) => {
            this.clients.push(client);
            this.resetForm();
        });
    }

    editClient(client: any): void {
        this.selectedClient = { ...client };
        this.isEditing = true;
    }

    updateClient(): void {
        this.ClientService.updateClient(
            this.selectedClient.id,
            this.selectedClient
        ).then(() => {
            const index = this.clients.findIndex(
                (c) => c.id === this.selectedClient.id
            );
            this.clients[index] = this.selectedClient;
            this.resetForm();
        });
    }

    deleteClient(client: any): void {
        this.ClientService.deleteClient(client.id).then(() => {
            this.clients = this.clients.filter((c) => c.id !== client.id);
        });
    }

    resetForm(): void {
        this.selectedClient = {};
        this.isEditing = false;
    }
}
