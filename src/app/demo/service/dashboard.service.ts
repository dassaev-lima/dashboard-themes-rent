import clientsApi from '../api/client'; // Altere o caminho se necessário
import themesApi from '../api/theme'; // Altere o caminho se necessário
import rentsApi from '../api/rent'; // Altere o caminho se necessário

export class DashboardService {
    constructor() {}

    async getClients() {
        try {
            const response = await clientsApi.get('');
            return response.data;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    }

    async getThemes() {
        try {
            const response = await themesApi.get('');
            return response.data;
        } catch (error) {
            console.error('Error fetching themes:', error);
            throw error;
        }
    }

    async getRents() {
        try {
            const response = await rentsApi.get('');
            return response.data;
        } catch (error) {
            console.error('Error fetching rents:', error);
            throw error;
        }
    }

    // Adicione mais métodos conforme necessário
}
