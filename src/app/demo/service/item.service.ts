// app/demo/service/item.service.ts
import itemApi from '../api/item';

export default interface Item {
    id: number;
    name: string;
    description: string;
}

export class ItemService {
    async getItems(): Promise<Item[]> {
        try {
            const response = await itemApi.get('');
            return response.data; // Retorna a lista de itens
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
            throw error;
        }
    }

    async addItem(item: Omit<Item, 'id'>): Promise<Item> {
        try {
            const response = await itemApi.post('', item);
            return response.data; // Retorna o item criado
        } catch (error) {
            console.error('Erro ao criar item:', error);
            throw error;
        }
    }

    async updateItem(id: number, item: Omit<Item, 'id'>): Promise<Item> {
        try {
            const response = await itemApi.put(`${id}/`, item);
            return response.data; // Retorna o item atualizado
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
            throw error;
        }
    }

    async deleteItem(id: number): Promise<void> {
        try {
            await itemApi.delete(`${id}/`);
            console.log(`Item com ID ${id} deletado com sucesso.`);
        } catch (error) {
            console.error('Erro ao deletar item:', error);
            throw error;
        }
    }
}
