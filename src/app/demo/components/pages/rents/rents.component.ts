import { Component, OnInit } from '@angular/core';
import { RentService } from 'src/app/demo/service/rent.service';
import { ClientService } from 'src/app/demo/service/client.service';
import { ThemeService } from 'src/app/demo/service/theme.service';
import { AddressService } from 'src/app/demo/service/address.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-rents',
    templateUrl: './rents.component.html',
    providers: [MessageService, ClientService, ThemeService, AddressService],
})
export class RentsComponent implements OnInit {
    rentDialog: boolean = false;
    deleteRentDialog: boolean = false;
    deleteRentsDialog: boolean = false;

    rents: any[] = [];
    rent: any = {};
    selectedRents: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];

    clients: any[] = [];
    themes: any[] = [];
    addresses: any[] = [];

    selectedClient: any = null;
    selectedTheme: any = null;
    selectedAddress: any = null;

    constructor(
        private rentService: RentService,
        private messageService: MessageService,
        private clientService: ClientService,
        private themeService: ThemeService,
        private addressService: AddressService
    ) {}

    ngOnInit(): void {
        this.loadRentsWithDetails();

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'date', header: 'Data' },
            { field: 'start_hours', header: 'Início' },
            { field: 'end_hours', header: 'Fim' },
            { field: 'client', header: 'Cliente' },
            { field: 'theme', header: 'Tema' },
            { field: 'address', header: 'Endereço' },
        ];
        this.clientService.getClients().then((clients) => {
            this.clients = clients;
        });
        this.themeService.getThemes().then((themes) => {
            this.themes = themes;
        });
        this.addressService.getAddresses().then((addresses) => {
            this.addresses = addresses;
        });
    }

    async loadRentsWithDetails() {
        try {
            const [rents, clients, themes, addresses] = await Promise.all([
                this.rentService.getRents(),
                this.clientService.getClients(),
                this.themeService.getThemes(),
                this.addressService.getAddresses(),
            ]);

            this.mapRentsWithDetails(rents, clients, themes, addresses);
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
    }

    mapRentsWithDetails(
        rents: any[],
        clients: any[],
        themes: any[],
        addresses: any[]
    ): void {
        this.rents = rents.map((rent) => {
            const client = clients.find((c) => c.id === rent.client);
            const theme = themes.find((t) => t.id === rent.theme);
            const address = addresses.find((a) => a.id === rent.address);

            return {
                ...rent, // Mantém os dados do rent original
                clientName: client ? client.name : 'Cliente não encontrado',
                themeName: theme ? theme.name : 'Tema não encontrado',
                addressName: address ? address.name : 'Endereço não encontrado',
            };
        });
    }

    openNew(): void {
        this.rent = {};
        this.submitted = false;
        this.rentDialog = true;
        this.selectedClient = null;
        this.selectedTheme = null;
        this.selectedAddress = null;
    }

    deleteSelectedRents(): void {
        this.deleteRentsDialog = true;
    }

    editRent(rent: any): void {
        this.rent = { ...rent };

        this.selectedClient = this.clients.find(
            (client) => client.id === this.rent.client
        );

        this.selectedTheme = this.themes.find(
            (theme) => theme.id === this.rent.theme
        );

        this.selectedAddress = this.addresses.find(
            (address) => address.id === this.rent.address
        );

        this.rentDialog = true;
    }

    deleteRent(rent: any): void {
        this.deleteRentDialog = true;
        this.rent = { ...rent };
    }

    confirmDeleteSelected(): void {
        this.deleteRentsDialog = false;
        this.selectedRents.forEach((rent) => {
            this.rentService.deleteRent(rent.id).then(() => {
                this.rents = this.rents.filter(
                    (r) => !this.selectedRents.includes(r)
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Aluguéis removidos com sucesso',
                    life: 3000,
                });
            });
        });
        this.selectedRents = [];
    }

    confirmDelete(): void {
        this.deleteRentDialog = false;
        this.rentService.deleteRent(this.rent.id).then(() => {
            this.rents = this.rents.filter((r) => r.id !== this.rent.id);
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Aluguel removido com sucesso',
                life: 3000,
            });
            this.rent = {};
        });
    }

    hideDialog(): void {
        this.rentDialog = false;
        this.deleteRentDialog = false;
        this.deleteRentsDialog = false;
        this.submitted = false;
    }

    saveRent(): void {
        this.submitted = true;
        this.rent.client = this.selectedClient.id;
        this.rent.theme = this.selectedTheme.id;
        this.rent.address = this.selectedAddress.id;

        if (
            this.rent.date?.trim() &&
            this.rent.start_hours?.trim() &&
            this.rent.end_hours?.trim()
        ) {
            if (this.rent.id) {
                this.rentService
                    .updateRent(this.rent.id, this.rent)
                    .then(() => {
                        const index = this.findIndexById(this.rent.id);
                        if (index !== -1) {
                            this.rents[index] = this.rent;
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Aluguel atualizado com sucesso',
                            life: 3000,
                        });

                        this.rents = [...this.rents];
                        this.rentDialog = false;
                        this.rent = {};
                    });
            } else {
                this.rentService.addRent(this.rent).then((newRent) => {
                    this.rents.push(newRent);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Aluguel cadastrado com sucesso',
                        life: 3000,
                    });

                    this.rents = [...this.rents];
                    this.rentDialog = false;
                    this.rent = {};
                });
            }
        }
    }

    findIndexById(id: number): number {
        return this.rents.findIndex((r) => r.id === id);
    }

    onGlobalFilter(table: any, event: Event): void {
        const valor = (event.target as HTMLInputElement).value;
        table.filterGlobal(valor, 'contains');
    }
}
