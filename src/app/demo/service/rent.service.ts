import rentApi from '../api/rent';

export interface Rent {
    id: number;
    date: string;
    start_hours: string;
    end_hours: string;
    client: number;
    theme: number;
    address: number;
}

export class RentService {
    async getRents(): Promise<Rent[]> {
        try {
            const response = await rentApi.get('');
            return response.data; // Retorna a lista de aluguéis
        } catch (error) {
            console.error('Erro ao buscar aluguéis:', error);
            throw error;
        }
    }

    async getRent(id: number): Promise<Rent> {
        try {
            const response = await rentApi.get(`${id}/`);
            return response.data; // Retorna o aluguel específico
        } catch (error) {
            console.error('Erro ao buscar aluguel:', error);
            throw error;
        }
    }

    async addRent(rent: Omit<Rent, 'id'>): Promise<Rent> {
        try {
            const response = await rentApi.post('', rent);
            return response.data; // Retorna o aluguel criado
        } catch (error) {
            console.error('Erro ao criar aluguel:', error);
            throw error;
        }
    }

    async updateRent(id: number, rent: Omit<Rent, 'id'>): Promise<Rent> {
        try {
            const response = await rentApi.put(`${id}/`, rent);
            return response.data; // Retorna o aluguel atualizado
        } catch (error) {
            console.error('Erro ao atualizar aluguel:', error);
            throw error;
        }
    }

    async deleteRent(id: number): Promise<void> {
        try {
            await rentApi.delete(`${id}/`);
            console.log(`Aluguel com ID ${id} deletado com sucesso.`);
        } catch (error) {
            console.error('Erro ao deletar aluguel:', error);
            throw error;
        }
    }

    /*async getTopClients(): Promise<any[]> {
        const rents = await this.getRents();

        const clientRentCount: { [key: string]: number } = {};

        rents.forEach((rent) => {
            const clientId = rent.client;
            if (clientRentCount[clientId]) {
                clientRentCount[clientId]++;
            } else {
                clientRentCount[clientId] = 1;
            }
        });

        // Transformar o resultado em um array e ordenar
        const topClients = Object.keys(clientRentCount)
            .map((clientId) => ({
                clientId: clientId,
                rentCount: clientRentCount[clientId],
            }))
            .sort((a, b) => b.rentCount - a.rentCount);

        return topClients; // Retorna a lista de clientes
    }*/
}
