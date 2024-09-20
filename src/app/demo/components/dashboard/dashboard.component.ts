import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../service/dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
    topClients: any[] = [];
    topThemes: any[] = [];
    totalThemes: number = 0;
    totalClients: number = 0;
    totalRents: number = 0;
    totalRevenue: number = 0;

    selectedMonth: string;
    months: string[];
    selectedYear: number;
    years: number[];

    chartData: any;
    chartOptions: any;
    revenueChartData: any;
    revenueChartOptions: any;

    constructor(private dashboardService: DashboardService) {}

    ngOnInit() {
        this.loadDashboardData();
        this.setChartOptions();
        this.setRevenueChartOptions();
    }

    setChartOptions() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057',
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                },
                y: {
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                },
            },
        };
    }

    async loadDashboardData() {
        try {
            const [clients, rents, themes] = await Promise.all([
                this.dashboardService.getClients(),
                this.dashboardService.getRents(),
                this.dashboardService.getThemes(),
            ]);

            this.totalThemes = themes.length;
            this.totalClients = clients.length;
            this.totalRents = rents.length;

            this.topClients = this.getTopClients(rents, clients);
            this.topThemes = this.getTopThemes(rents, themes);
            this.calculateTotalRevenue(rents, themes);
            this.getRentData(rents);
            this.calculateRevenueData(rents);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    getTopClients(rents: any[], clients: any[]): any[] {
        const clientCounts: { [key: string]: number } = {};

        rents.forEach((rent) => {
            const clientId = rent.client;
            clientCounts[clientId] = (clientCounts[clientId] || 0) + 1;
        });

        console.log('Client Counts:', clientCounts); // Log para depuração

        return clients
            .map((client) => ({
                ...client, // Inclui todas as propriedades do cliente
                rentCount: clientCounts[String(client.id)] || 0, // Adiciona a contagem de aluguéis
            }))
            .sort((a, b) => b.rentCount - a.rentCount) // Ordena de forma decrescente por rentCount
            .slice(0, 5); // Seleciona os 5 primeiros
    }

    getTopThemes(rents: any[], themes: any[]): any[] {
        const themeCounts: { [key: string]: number } = {};

        rents.forEach((rent) => {
            const themeId = rent.theme;
            themeCounts[themeId] = (themeCounts[themeId] || 0) + 1;
        });

        console.log('Theme Counts:', themeCounts); // Log para depuração

        return themes
            .map((theme) => ({
                ...theme, // Inclui todas as propriedades do tema
                rentCount: themeCounts[String(theme.id)] || 0, // Adiciona a contagem de aluguéis
            }))
            .sort((a, b) => b.rentCount - a.rentCount) // Ordena de forma decrescente por rentCount
            .slice(0, 5); // Seleciona os 5 primeiros
    }

    async calculateTotalRevenue(rents: any[], themes: any[]): Promise<number> {
        let total = 0;

        const themeCount: { [id: string]: number } = {}; // Objeto para armazenar a recorrência dos temas

        rents.forEach((rent) => {
            const themeId = rent.theme; // Pega o id do tema do aluguel
            themeCount[themeId] = (themeCount[themeId] || 0) + 1; // Incrementa a contagem de cada tema
        });

        for (const themeId of Object.keys(themeCount)) {
            const theme = themes.find((t) => t.id === Number(themeId)); // Busca o tema correspondente pelo ID

            if (theme && theme.price) {
                const revenueForTheme = theme.price * themeCount[themeId]; // Multiplica o preço do tema pela sua recorrência
                total += revenueForTheme; // Atualiza o total
            }
        }

        this.totalRevenue = total;

        return total; // Retorna o total da receita
    }

    // Função que recebe os dados de rents e calcula a quantidade de aluguéis por mês
    getRentData(rents: any) {
        const rentalData = this.calculateMonthlyRents(rents); // Processa os dados de 'rents'
        this.chartData = {
            labels: [
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro',
            ],
            datasets: [
                {
                    label: 'Temas Alugados',
                    data: rentalData, // Usa os dados calculados
                    fill: false,
                    borderColor: '#6368F3',
                    tension: 0.4,
                },
            ],
        };
    }

    // Função para processar os dados de 'rents' e calcular o total por mês
    calculateMonthlyRents(rents: any): number[] {
        // Inicializa um array para armazenar a quantidade de temas alugados por mês
        const monthlyRents = Array(12).fill(0); // 12 meses (de janeiro a dezembro)

        rents.forEach((rent: any) => {
            // Extrai o mês da data do aluguel
            const rentDate = new Date(rent.date);
            const month = rentDate.getMonth(); // Retorna o índice do mês (0 para janeiro, 1 para fevereiro, etc.)

            // Incrementa o contador de temas alugados para o mês correspondente
            monthlyRents[month]++;
        });

        return monthlyRents; // Retorna o array com a quantidade de aluguéis por mês
    }

    // Função que recebe os dados de rents e calcula a receita mensal
    calculateRevenueData(rents: any) {
        const revenueData = this.calculateMonthlyRevenue(rents);
        this.revenueChartData = {
            labels: [
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro',
            ],
            datasets: [
                {
                    label: 'Receita Mensal',
                    data: revenueData,
                    fill: false,
                    borderColor: '#6368F3',
                    tension: 0.4,
                },
            ],
        };
    }

    // Função para processar os dados de 'rents' e calcular a receita total por mês
    calculateMonthlyRevenue(rents: any): number[] {
        const monthlyRevenue = Array(12).fill(0); // 12 meses (de janeiro a dezembro)

        rents.forEach((rent: any) => {
            const rentDate = new Date(rent.date);
            const month = rentDate.getMonth();
            const price = rent.price;

            // Incrementa a receita total para o mês correspondente
            monthlyRevenue[month] += price;
        });

        return monthlyRevenue;
    }

    // Opções de estilo do gráfico
    setRevenueChartOptions() {
        this.revenueChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057',
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                },
                y: {
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                },
            },
        };
    }
}
