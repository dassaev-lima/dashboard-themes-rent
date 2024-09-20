// app/demo/service/client.service.ts
import clientApi from '../api/client';

export interface Client {
    id: number;
    name: string;
    email: string;
}

export class ClientService {
    async getClients(): Promise<Client[]> {
        try {
            const response = await clientApi.get('');
            return response.data; // Retorna a lista de clientes
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            throw error;
        }
    }

    async addClient(client: Omit<Client, 'id'>): Promise<Client> {
        try {
            const response = await clientApi.post('', client);
            return response.data; // Retorna o cliente criado
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    }

    async updateClient(
        id: number,
        client: Omit<Client, 'id'>
    ): Promise<Client> {
        try {
            const response = await clientApi.put(`${id}/`, client);
            return response.data; // Retorna o cliente atualizado
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    }

    async deleteClient(id: number): Promise<void> {
        try {
            await clientApi.delete(`${id}/`);
            console.log(`Cliente com ID ${id} deletado com sucesso.`);
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            throw error;
        }
    }
}
