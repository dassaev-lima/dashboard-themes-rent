// app/demo/service/client.service.ts
import themeApi from '../api/theme';

export interface Theme {
    id: number;
    name: string;
    color: string;
    price: number;
    itens: number[];
}

export class ThemeService {
    async getThemes(): Promise<Theme[]> {
        try {
            const response = await themeApi.get('');
            response.data.map((theme) => {
                theme.price = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(theme.price);
            });
            return response.data; // Retorna a lista de temas
        } catch (error) {
            console.error('Erro ao buscar temas:', error);
            throw error;
        }
    }

    async getTheme(themeId: number): Promise<Theme | null> {
        try {
            const response = await themeApi.get(`/${themeId}`);
            const theme = response.data;

            if (theme) {
                theme.price = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(theme.price);
                return theme; // Retorna o tema formatado
            } else {
                return null; // Retorna null se o tema não for encontrado
            }
        } catch (error) {
            console.error('Erro ao buscar tema:', error);
            throw error; // Repassa o erro
        }
    }

    async addTheme(client: Omit<Theme, 'id'>): Promise<Theme> {
        try {
            const response = await themeApi.post('', client);
            return response.data; // Retorna o tema criado
        } catch (error) {
            console.error('Erro ao criar tema:', error);
            throw error;
        }
    }

    async updateTheme(id: number, client: Omit<Theme, 'id'>): Promise<Theme> {
        try {
            const response = await themeApi.put(`${id}/`, client);
            return response.data; // Retorna o tema atualizado
        } catch (error) {
            console.error('Erro ao atualizar tema:', error);
            throw error;
        }
    }

    async deleteTheme(id: number): Promise<void> {
        try {
            await themeApi.delete(`${id}/`);
            console.log(`Theme com ID ${id} deletado com sucesso.`);
        } catch (error) {
            console.error('Erro ao deletar tema:', error);
            throw error;
        }
    }

    async deleteThemes(ids: number[]): Promise<void> {
        try {
            await Promise.all(ids.map((id) => themeApi.delete(`${id}/`)));
            console.log(
                `Temas com IDs ${ids.join(', ')} deletados com sucesso.`
            );
        } catch (error) {
            console.error('Erro ao deletar temas:', error);
            throw error;
        }
    }
}
