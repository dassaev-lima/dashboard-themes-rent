import addressApi from '../api/address';

export interface Address {
    id: number;
    street: string;
    number: number;
    complement?: string;
    district: string;
    city: string;
    state: string;
}

export class AddressService {
    async getAddresses(): Promise<Address[]> {
        try {
            const response = await addressApi.get('');
            return response.data; // Retorna a lista de endereços
        } catch (error) {
            console.error('Erro ao buscar endereços:', error);
            throw error;
        }
    }

    async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
        try {
            const response = await addressApi.post('', address);
            return response.data; // Retorna o endereço criado
        } catch (error) {
            console.error('Erro ao criar endereço:', error);
            throw error;
        }
    }

    async updateAddress(
        id: number,
        address: Omit<Address, 'id'>
    ): Promise<Address> {
        try {
            const response = await addressApi.put(`${id}/`, address);
            return response.data; // Retorna o endereço atualizado
        } catch (error) {
            console.error('Erro ao atualizar endereço:', error);
            throw error;
        }
    }

    async deleteAddress(id: number): Promise<void> {
        try {
            await addressApi.delete(`${id}/`);
            console.log(`Endereço com ID ${id} deletado com sucesso.`);
        } catch (error) {
            console.error('Erro ao deletar endereço:', error);
            throw error;
        }
    }
}
