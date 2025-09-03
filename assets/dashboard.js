// Analytics Dashboard JavaScript
class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.data = {
            salesData: this.generateSalesData(),
            revenueData: {
                labels: ['Web Sales', 'Mobile App', 'In-Store'],
                datasets: [{
                    data: [45, 35, 20],
                    backgroundColor: ['#0d6efd', '#198754', '#ffc107'],
                    borderWidth: 0
                }]
            },
            topProducts: [
                { name: 'Premium Software License', sales: 1847, revenue: 2847520, trend: 'up', change: '+15.3%' },
                { name: 'Mobile App Development', sales: 924, revenue: 1847000, trend: 'up', change: '+8.7%' },
                { name: 'Web Development Service', sales: 1247, revenue: 1456320, trend: 'up', change: '+12.1%' },
                { name: 'Cloud Integration', sales: 687, revenue: 987450, trend: 'down', change: '-3.2%' },
                { name: 'AI Chatbot Solution', sales: 534, revenue: 756890, trend: 'up', change: '+22.8%' }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.updateLastUpdated();
        this.initializeCharts();
        this.loadTopProducts();
        this.animateCounters();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }
    
    updateLastUpdated() {
        const now = new Date();
        const formatted = now.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        document.getElementById('lastUpdated').textContent = formatted;
    }
    
    generateSalesData() {
        const labels = [];
        const salesData = [];
        const revenueData = [];
        
        // Generate last 7 days data
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-IN', { 
                month: 'short', 
                day: 'numeric' 
            }));
            
            // Generate realistic sales data with some randomness
            const baseSales = 250 + Math.random() * 100;
            const baseRevenue = baseSales * (800 + Math.random() * 400);
            
            salesData.push(Math.round(baseSales));
            revenueData.push(Math.round(baseRevenue));
        }
        
        return {
            labels,
            datasets: [{
                label: 'Sales Count',
                data: salesData,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Revenue (₹)',
                data: revenueData,
                borderColor: '#198754',
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }]
        };
    }
    
    initializeCharts() {
        // Sales Performance Chart
        const salesCtx = document.getElementById('salesChart').getContext('2d');
        this.charts.sales = new Chart(salesCtx, {
            type: 'line',
            data: this.data.salesData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.datasetIndex === 1) {
                                    label += '₹' + context.parsed.y.toLocaleString('en-IN');
                                } else {
                                    label += context.parsed.y;
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Sales Count'
                        }
                    },
                    y1: {
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Revenue (₹)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        
        // Revenue Sources Pie Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        this.charts.revenue = new Chart(revenueCtx, {
            type: 'doughnut',
            data: this.data.revenueData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
    
    loadTopProducts() {
        const tbody = document.getElementById('topProductsTable');
        tbody.innerHTML = this.data.topProducts.map((product, index) => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="product-rank me-3">
                            <span class="badge ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : index === 2 ? 'bg-info' : 'bg-light text-dark'}">${index + 1}</span>
                        </div>
                        <div>
                            <div class="fw-semibold">${product.name}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="fw-semibold">${product.sales.toLocaleString()}</span>
                </td>
                <td>
                    <span class="fw-semibold text-success">₹${product.revenue.toLocaleString('en-IN')}</span>
                </td>
                <td>
                    <span class="trend ${product.trend === 'up' ? 'text-success' : 'text-danger'}">
                        <i class="fas fa-arrow-${product.trend === 'up' ? 'up' : 'down'} me-1"></i>
                        ${product.change}
                    </span>
                </td>
            </tr>
        `).join('');
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.kpi-value[data-target], .insight-value[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 50);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (counter.textContent.includes('₹')) {
                    counter.textContent = '₹' + Math.floor(current).toLocaleString('en-IN');
                } else if (counter.textContent.includes('%')) {
                    counter.textContent = Math.floor(current) + '%';
                } else {
                    counter.textContent = Math.floor(current).toLocaleString('en-IN');
                }
            }, 50);
        });
    }
    
    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                document.querySelectorAll('.sidebar-nav .nav-item').forEach(nav => {
                    nav.classList.remove('active');
                });
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Show notification (in a real app, this would change the content)
                this.showNotification(`Switched to ${item.textContent.trim()}`, 'info');
            });
        });
        
        // Time period buttons for sales chart
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateSalesChart(e.target.dataset.period);
            });
        });
    }
    
    updateSalesChart(period) {
        // In a real app, this would fetch data for the selected period
        this.showNotification(`Loading ${period} data...`, 'info');
        
        // Simulate data loading
        setTimeout(() => {
            this.charts.sales.data = this.generateSalesData();
            this.charts.sales.update();
            this.showNotification(`Updated to ${period} view`, 'success');
        }, 500);
    }
    
    startRealTimeUpdates() {
        // Simulate real-time data updates every 30 seconds
        setInterval(() => {
            this.updateLastUpdated();
            
            // Randomly update one of the KPI values
            const kpiCards = document.querySelectorAll('.kpi-value[data-target]');
            if (kpiCards.length > 0) {
                const randomCard = kpiCards[Math.floor(Math.random() * kpiCards.length)];
                const currentTarget = parseInt(randomCard.getAttribute('data-target'));
                const variation = Math.floor(currentTarget * 0.02 * (Math.random() - 0.5)); // ±1% variation
                const newTarget = currentTarget + variation;
                
                randomCard.setAttribute('data-target', newTarget);
                
                // Animate to new value
                if (randomCard.textContent.includes('₹')) {
                    randomCard.textContent = '₹' + newTarget.toLocaleString('en-IN');
                } else if (randomCard.textContent.includes('%')) {
                    randomCard.textContent = newTarget + '%';
                } else {
                    randomCard.textContent = newTarget.toLocaleString('en-IN');
                }
            }
        }, 30000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'info' ? 'info-circle' : 'exclamation-triangle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Global functions for UI interactions
function refreshData() {
    dashboard.showNotification('Refreshing dashboard data...', 'info');
    
    // Simulate data refresh
    setTimeout(() => {
        dashboard.charts.sales.data = dashboard.generateSalesData();
        dashboard.charts.sales.update();
        dashboard.loadTopProducts();
        dashboard.updateLastUpdated();
        dashboard.showNotification('Dashboard data refreshed successfully!', 'success');
    }, 1500);
}

function exportData() {
    dashboard.showNotification('Preparing data export...', 'info');
    
    // Simulate export process
    setTimeout(() => {
        dashboard.showNotification('Export completed! Check your downloads.', 'success');
    }, 2000);
}

function showSettings() {
    dashboard.showNotification('Settings panel would open here in the full version', 'info');
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', function() {
    dashboard = new AnalyticsDashboard();
    
    console.log('📊 Analytics Dashboard loaded successfully!');
    console.log('Features: Real-time KPIs, Interactive Charts, Data Export, Live Updates');
});

// Add some demo interactions
setTimeout(() => {
    dashboard.showNotification('🚀 Welcome to your Analytics Dashboard! Data is updating in real-time.', 'success');
}, 2000);

// Handle window resize for charts
window.addEventListener('resize', () => {
    Object.values(dashboard.charts).forEach(chart => {
        chart.resize();
    });
});
