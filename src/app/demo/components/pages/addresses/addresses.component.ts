import { Component, OnInit } from '@angular/core';
import { AddressService } from 'src/app/demo/service/address.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-addresses',
    templateUrl: './addresses.component.html',
    providers: [MessageService, AddressService],
})
export class AddressesComponent implements OnInit {
    addressDialog: boolean = false;
    deleteAddressDialog: boolean = false;
    deleteAddressesDialog: boolean = false;

    addresses: any[] = [];
    address: any = {};
    selectedAddresses: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];

    constructor(
        private addressService: AddressService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadAddresses();

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'street', header: 'Rua' },
            { field: 'city', header: 'Cidade' },
            { field: 'state', header: 'Estado' },
            { field: 'zip', header: 'CEP' },
        ];
    }

    loadAddresses(): void {
        this.addressService.getAddresses().then((data) => {
            this.addresses = data;
        });
    }

    openNew(): void {
        this.address = {};
        this.submitted = false;
        this.addressDialog = true;
    }

    editAddress(address: any): void {
        this.address = { ...address };
        this.addressDialog = true;
    }

    deleteAddress(address: any): void {
        this.deleteAddressDialog = true;
        this.address = { ...address };
    }

    deleteSelectedAddresses(): void {
        this.deleteAddressesDialog = true;
    }

    confirmDeleteSelected(): void {
        this.deleteAddressesDialog = false;
        this.selectedAddresses.forEach((address) => {
            this.addressService.deleteAddress(address.id).then(() => {
                this.addresses = this.addresses.filter(
                    (a) => !this.selectedAddresses.includes(a)
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Endereços removidos com sucesso',
                    life: 3000,
                });
            });
        });
        this.selectedAddresses = [];
    }

    confirmDelete(): void {
        this.deleteAddressDialog = false;
        this.addressService.deleteAddress(this.address.id).then(() => {
            this.addresses = this.addresses.filter(
                (a) => a.id !== this.address.id
            );
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Endereço removido com sucesso',
                life: 3000,
            });
            this.address = {};
        });
    }

    hideDialog(): void {
        this.addressDialog = false;
        this.deleteAddressDialog = false;
        this.deleteAddressesDialog = false;
        this.submitted = false;
    }

    saveAddress(): void {
        this.submitted = true;

        if (this.address.street?.trim() && this.address.city?.trim()) {
            if (this.address.id) {
                this.addressService
                    .updateAddress(this.address.id, this.address)
                    .then(() => {
                        const index = this.findIndexById(this.address.id);
                        if (index !== -1) {
                            this.addresses[index] = this.address;
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Endereço atualizado com sucesso',
                            life: 3000,
                        });

                        this.addresses = [...this.addresses];
                        this.addressDialog = false;
                        this.address = {};
                    });
            } else {
                this.addressService
                    .addAddress(this.address)
                    .then((novoAddress) => {
                        this.addresses.push(novoAddress);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Endereço cadastrado com sucesso',
                            life: 3000,
                        });

                        this.addresses = [...this.addresses];
                        this.addressDialog = false;
                        this.address = {};
                    });
            }
        }
    }

    findIndexById(id: number): number {
        return this.addresses.findIndex((a) => a.id === id);
    }

    onGlobalFilter(table: any, event: Event): void {
        const valor = (event.target as HTMLInputElement).value;
        table.filterGlobal(valor, 'contains');
    }
}
