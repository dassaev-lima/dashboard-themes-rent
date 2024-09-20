import { Component, OnInit } from '@angular/core';
import { RentService } from 'src/app/demo/service/rent.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-rents',
    templateUrl: './rents.component.html',
    providers: [MessageService],
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

    constructor(
        private rentService: RentService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.rentService.getRents().then((data) => {
            this.rents = data;
        });

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'date', header: 'Data' },
            { field: 'start_hours', header: 'Início' },
            { field: 'end_hours', header: 'Fim' },
            { field: 'client', header: 'Cliente' },
            { field: 'theme', header: 'Tema' },
            { field: 'address', header: 'Endereço' },
        ];
    }

    openNew(): void {
        this.rent = {};
        this.submitted = false;
        this.rentDialog = true;
    }

    deleteSelectedRents(): void {
        this.deleteRentsDialog = true;
    }

    editRent(rent: any): void {
        this.rent = { ...rent };
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
