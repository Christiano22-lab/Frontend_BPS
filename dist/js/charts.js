/**
 * D3.js Chart Rendering Functions
 * Handles rendering of various chart types using D3.js
 * 
 * Note: This file requires D3.js and CHART_CONFIG to be loaded first
 */

// Helper function to get chart config with fallback
function getChartConfig() {
    if (typeof CHART_CONFIG !== 'undefined') {
        return CHART_CONFIG;
    }
    return {
        COLORS: {
            PRIMARY: '#003D7A',
            SECONDARY: '#4FC3F7',
            SUCCESS: '#4CAF50',
            WARNING: '#FF9800',
            DANGER: '#F44336',
            CHART_COLORS: ['#003D7A', '#4FC3F7', '#4CAF50', '#FF9800', '#9C27B0', '#2196F3', '#F44336']
        },
        DIMENSIONS: {
            WIDTH: 800,
            HEIGHT: 400,
            MARGIN: { top: 20, right: 30, bottom: 40, left: 60 }
        }
    };
}

/**
 * Create a line chart using D3.js
 * @param {HTMLElement} container - Container element
 * @param {object} data - Chart data {labels: [], values: [], title: string}
 * @param {object} options - Chart options
 */
function createLineChart(container, data, options = {}) {
    if (!container || !data || !data.labels || !data.values) {
        console.error('Invalid data for line chart');
        return;
    }

    // Check if D3.js is loaded
    if (typeof d3 === 'undefined') {
        console.error('D3.js is not loaded');
        return;
    }

    const config = getChartConfig();

    // Clear container
    container.innerHTML = '';
    
    const margin = options.margin || config.DIMENSIONS.MARGIN;
    const width = (options.width || container.clientWidth || config.DIMENSIONS.WIDTH) - margin.left - margin.right;
    const height = (options.height || container.clientHeight || config.DIMENSIONS.HEIGHT) - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scalePoint()
        .domain(data.labels)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data.values) * 1.1])
        .nice()
        .range([height, 0]);

    // Create line generator
    const line = d3.line()
        .x((d, i) => xScale(data.labels[i]))
        .y(d => yScale(d))
        .curve(d3.curveMonotoneX);

    // Add grid lines
    g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .tickSize(-height)
            .tickFormat(''))
        .selectAll('line')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-dasharray', '2,2');

    g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat(''))
        .selectAll('line')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-dasharray', '2,2');

    // Add axes
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    g.append('g')
        .call(d3.axisLeft(yScale));

    // Add line
    g.append('path')
        .datum(data.values)
        .attr('fill', 'none')
        .attr('stroke', options.color || config.COLORS.PRIMARY)
        .attr('stroke-width', 2.5)
        .attr('d', line);

    // Add circles for data points
    g.selectAll('.dot')
        .data(data.values)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', (d, i) => xScale(data.labels[i]))
        .attr('cy', d => yScale(d))
        .attr('r', 4)
        .attr('fill', options.color || config.COLORS.PRIMARY)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('r', 6);
            showTooltip(event, data.labels[data.values.indexOf(d)], d);
        })
        .on('mouseout', function() {
            d3.select(this).attr('r', 4);
            hideTooltip();
        });
}

/**
 * Create a multi-line chart using D3.js
 * @param {HTMLElement} container - Container element
 * @param {object} data - Chart data {labels: [], datasets: [{label: string, values: [], color: string}]}
 * @param {object} options - Chart options
 */
function createMultiLineChart(container, data, options = {}) {
    if (!container || !data || !data.labels || !data.datasets) {
        console.error('Invalid data for multi-line chart');
        return;
    }

    if (typeof d3 === 'undefined') {
        console.error('D3.js is not loaded');
        return;
    }

    const config = getChartConfig();

    container.innerHTML = '';
    
    const margin = options.margin || config.DIMENSIONS.MARGIN;
    const width = (options.width || container.clientWidth || config.DIMENSIONS.WIDTH) - margin.left - margin.right;
    const height = (options.height || container.clientHeight || config.DIMENSIONS.HEIGHT) - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scalePoint()
        .domain(data.labels)
        .range([0, width])
        .padding(0.1);

    const allValues = data.datasets.flatMap(d => d.values);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(allValues) * 1.1])
        .nice()
        .range([height, 0]);

    const line = d3.line()
        .x((d, i) => xScale(data.labels[i]))
        .y(d => yScale(d))
        .curve(d3.curveMonotoneX);

    // Add axes
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    g.append('g')
        .call(d3.axisLeft(yScale));

    // Add lines for each dataset
    data.datasets.forEach((dataset, index) => {
        g.append('path')
            .datum(dataset.values)
            .attr('fill', 'none')
            .attr('stroke', dataset.color || config.COLORS.CHART_COLORS[index % config.COLORS.CHART_COLORS.length])
            .attr('stroke-width', 2.5)
            .attr('d', line);

        // Add circles
        g.selectAll(`.dot-${index}`)
            .data(dataset.values)
            .enter().append('circle')
            .attr('class', `dot-${index}`)
            .attr('cx', (d, i) => xScale(data.labels[i]))
            .attr('cy', d => yScale(d))
            .attr('r', 4)
            .attr('fill', dataset.color || config.COLORS.CHART_COLORS[index % config.COLORS.CHART_COLORS.length])
            .on('mouseover', function(event, d, i) {
                d3.select(this).attr('r', 6);
                showTooltip(event, `${dataset.label}: ${data.labels[i] || 'Data'}`, d);
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', 4);
                hideTooltip();
            });
    });

    // Add legend
    const legend = g.append('g')
        .attr('transform', `translate(${width - 100}, 10)`);

    data.datasets.forEach((dataset, index) => {
        const legendItem = legend.append('g')
            .attr('transform', `translate(0, ${index * 20})`);

        legendItem.append('line')
            .attr('x1', 0)
            .attr('x2', 20)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', dataset.color || config.COLORS.CHART_COLORS[index % config.COLORS.CHART_COLORS.length])
            .attr('stroke-width', 2);

        legendItem.append('text')
            .attr('x', 25)
            .attr('y', 4)
            .text(dataset.label)
            .style('font-size', '12px')
            .style('fill', '#666');
    });
}

/**
 * Create a bar chart using D3.js
 * @param {HTMLElement} container - Container element
 * @param {object} data - Chart data {labels: [], values: [], title: string}
 * @param {object} options - Chart options
 */
function createBarChart(container, data, options = {}) {
    if (!container || !data || !data.labels || !data.values) {
        console.error('Invalid data for bar chart');
        return;
    }

    if (typeof d3 === 'undefined') {
        console.error('D3.js is not loaded');
        return;
    }

    const config = getChartConfig();

    container.innerHTML = '';
    
    const margin = options.margin || config.DIMENSIONS.MARGIN;
    const width = (options.width || container.clientWidth || config.DIMENSIONS.WIDTH) - margin.left - margin.right;
    const height = (options.height || container.clientHeight || config.DIMENSIONS.HEIGHT) - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(data.labels)
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data.values) * 1.1])
        .nice()
        .range([height, 0]);

    // Add axes
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    g.append('g')
        .call(d3.axisLeft(yScale));

    // Add bars
    g.selectAll('.bar')
        .data(data.values)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => xScale(data.labels[i]))
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(d))
        .attr('height', d => height - yScale(d))
        .attr('fill', options.color || config.COLORS.PRIMARY)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('fill', config.COLORS.SECONDARY);
            showTooltip(event, data.labels[data.values.indexOf(d)], d);
        })
        .on('mouseout', function() {
            d3.select(this).attr('fill', options.color || config.COLORS.PRIMARY);
            hideTooltip();
        });
}

/**
 * Create a stacked bar chart using D3.js
 * @param {HTMLElement} container - Container element
 * @param {object} data - Chart data {labels: [], datasets: [{label: string, values: [], color: string}]}
 * @param {object} options - Chart options
 */
function createStackedBarChart(container, data, options = {}) {
    if (!container || !data || !data.labels || !data.datasets) {
        console.error('Invalid data for stacked bar chart');
        return;
    }

    if (typeof d3 === 'undefined') {
        console.error('D3.js is not loaded');
        return;
    }

    const config = getChartConfig();

    container.innerHTML = '';
    
    const margin = options.margin || config.DIMENSIONS.MARGIN;
    const width = (options.width || container.clientWidth || config.DIMENSIONS.WIDTH) - margin.left - margin.right;
    const height = (options.height || container.clientHeight || config.DIMENSIONS.HEIGHT) - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare stacked data
    const stack = d3.stack()
        .keys(data.datasets.map(d => d.label));

    const series = stack(data.labels.map((label, i) => {
        const obj = { label };
        data.datasets.forEach(dataset => {
            obj[dataset.label] = dataset.values[i] || 0;
        });
        return obj;
    }));

    const xScale = d3.scaleBand()
        .domain(data.labels)
        .range([0, width])
        .padding(0.2);

    const maxValue = d3.max(series, d => d3.max(d, d => d[1]));
    const yScale = d3.scaleLinear()
        .domain([0, maxValue * 1.1])
        .nice()
        .range([height, 0]);

    // Add axes
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    g.append('g')
        .call(d3.axisLeft(yScale));

    // Add stacked bars
    const groups = g.selectAll('.group')
        .data(series)
        .enter().append('g')
        .attr('class', 'group')
        .attr('fill', (d, i) => data.datasets[i].color || config.COLORS.CHART_COLORS[i % config.COLORS.CHART_COLORS.length]);

    groups.selectAll('rect')
        .data(d => d)
        .enter().append('rect')
        .attr('x', d => xScale(d.data.label))
        .attr('y', d => yScale(d[1]))
        .attr('height', d => yScale(d[0]) - yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .on('mouseover', function(event, d) {
            showTooltip(event, d.data.label, d[1] - d[0]);
        })
        .on('mouseout', function() {
            hideTooltip();
        });

    // Add legend
    const legend = g.append('g')
        .attr('transform', `translate(${width - 100}, 10)`);

    data.datasets.forEach((dataset, index) => {
        const legendItem = legend.append('g')
            .attr('transform', `translate(0, ${index * 20})`);

        legendItem.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', dataset.color || config.COLORS.CHART_COLORS[index % config.COLORS.CHART_COLORS.length]);

        legendItem.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(dataset.label)
            .style('font-size', '12px')
            .style('fill', '#666');
    });
}

/**
 * Create a pie chart using D3.js
 * @param {HTMLElement} container - Container element
 * @param {object} data - Chart data {labels: [], values: []}
 * @param {object} options - Chart options
 */
function createPieChart(container, data, options = {}) {
    if (!container || !data || !data.labels || !data.values) {
        console.error('Invalid data for pie chart');
        return;
    }

    if (typeof d3 === 'undefined') {
        console.error('D3.js is not loaded');
        return;
    }

    const config = getChartConfig();

    container.innerHTML = '';
    
    const width = options.width || container.clientWidth || 400;
    const height = options.height || container.clientHeight || 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.labels)
        .range(config.COLORS.CHART_COLORS);

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcLabel = d3.arc()
        .innerRadius(radius + 20)
        .outerRadius(radius + 20);

    const data_ready = pie(data.labels.map((label, i) => ({
        label,
        value: data.values[i]
    })));

    svg.selectAll('path')
        .data(data_ready)
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label))
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 0.8);
            showTooltip(event, d.data.label, d.data.value);
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 1);
            hideTooltip();
        });

    // Add labels
    svg.selectAll('text')
        .data(data_ready)
        .enter().append('text')
        .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => d.data.label)
        .style('font-size', '12px')
        .style('fill', '#666');
}

/**
 * Show tooltip for charts
 */
function showTooltip(event, label, value) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = `<strong>${label}</strong><br/>Nilai: ${formatNumber(value)}`;
    
    // Better positioning - avoid going off screen
    const tooltipWidth = 200;
    const tooltipHeight = 60;
    const padding = 10;
    
    let left = event.pageX + padding;
    let top = event.pageY - padding;
    
    // Check if tooltip goes off right edge
    if (left + tooltipWidth > window.innerWidth) {
        left = event.pageX - tooltipWidth - padding;
    }
    
    // Check if tooltip goes off bottom edge
    if (top + tooltipHeight > window.innerHeight) {
        top = event.pageY - tooltipHeight - padding;
    }
    
    // Check if tooltip goes off left edge
    if (left < 0) {
        left = padding;
    }
    
    // Check if tooltip goes off top edge
    if (top < 0) {
        top = padding;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.classList.add('show');
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    tooltip.classList.remove('show');
}

/**
 * Create a mini chart preview for dashboard cards
 * @param {HTMLElement} container - Container element
 * @param {object} data - Chart data
 * @param {string} chartType - Type of chart (line, bar, pie, multiline, stacked)
 */
function createMiniChart(container, data, chartType = 'line') {
    if (!container || !data) {
        console.error('Invalid data for mini chart', { container, data });
        return;
    }

    // Check if D3.js is loaded
    if (typeof d3 === 'undefined') {
        console.error('D3.js is not loaded');
        return;
    }

    // Get chart config with fallback
    const config = getChartConfig();
    const colors = config.COLORS;

    container.innerHTML = '';
    
    const width = container.clientWidth || 250;
    const height = 180;
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    if (chartType === 'line' && data.values) {
        const xScale = d3.scalePoint()
            .domain(data.labels || [])
            .range([0, chartWidth])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data.values) * 1.1])
            .nice()
            .range([chartHeight, 0]);

        const line = d3.line()
            .x((d, i) => xScale((data.labels || [])[i]))
            .y(d => yScale(d))
            .curve(d3.curveMonotoneX);

        g.append('path')
            .datum(data.values)
            .attr('fill', 'none')
            .attr('stroke', colors.PRIMARY)
            .attr('stroke-width', 2)
            .attr('d', line);

        g.selectAll('.dot')
            .data(data.values)
            .enter().append('circle')
            .attr('cx', (d, i) => xScale((data.labels || [])[i]))
            .attr('cy', d => yScale(d))
            .attr('r', 2.5)
            .attr('fill', colors.PRIMARY);
    } else if (chartType === 'bar' && data.values) {
        const xScale = d3.scaleBand()
            .domain(data.labels || [])
            .range([0, chartWidth])
            .padding(0.3);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data.values) * 1.1])
            .nice()
            .range([chartHeight, 0]);

        g.selectAll('.bar')
            .data(data.values)
            .enter().append('rect')
            .attr('x', (d, i) => xScale((data.labels || [])[i]))
            .attr('width', xScale.bandwidth())
            .attr('y', d => yScale(d))
            .attr('height', d => chartHeight - yScale(d))
            .attr('fill', colors.PRIMARY);
    } else if (chartType === 'pie' && data.values) {
        const radius = Math.min(chartWidth, chartHeight) / 2 - 10;
        const pie = d3.pie().value(d => d.value).sort(null);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);
        const color = d3.scaleOrdinal().range(colors.CHART_COLORS);

        const pieData = pie((data.labels || []).map((label, i) => ({
            label,
            value: data.values[i]
        })));

        // Update transform for pie chart (center it)
        g.attr('transform', `translate(${chartWidth / 2}, ${chartHeight / 2})`);

        g.selectAll('path')
            .data(pieData)
            .enter().append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.label))
            .attr('stroke', 'white')
            .attr('stroke-width', 1);
    } else if (chartType === 'multiline' && data.datasets) {
        const xScale = d3.scalePoint()
            .domain(data.labels || [])
            .range([0, chartWidth])
            .padding(0.1);

        const allValues = data.datasets.flatMap(d => d.values);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(allValues) * 1.1])
            .nice()
            .range([chartHeight, 0]);

        const line = d3.line()
            .x((d, i) => xScale((data.labels || [])[i]))
            .y(d => yScale(d))
            .curve(d3.curveMonotoneX);

        data.datasets.forEach((dataset, index) => {
            g.append('path')
                .datum(dataset.values)
                .attr('fill', 'none')
                .attr('stroke', dataset.color || colors.CHART_COLORS[index])
                .attr('stroke-width', 2)
                .attr('d', line);
        });
    } else if (chartType === 'stacked' && data.datasets) {
        const xScale = d3.scaleBand()
            .domain(data.labels || [])
            .range([0, chartWidth])
            .padding(0.3);

        const stack = d3.stack().keys(data.datasets.map(d => d.label));
        const series = stack((data.labels || []).map((label, i) => {
            const obj = { label };
            data.datasets.forEach(dataset => {
                obj[dataset.label] = dataset.values[i] || 0;
            });
            return obj;
        }));

        const maxValue = d3.max(series, d => d3.max(d, d => d[1]));
        const yScale = d3.scaleLinear()
            .domain([0, maxValue * 1.1])
            .nice()
            .range([chartHeight, 0]);

        const groups = g.selectAll('.group')
            .data(series)
            .enter().append('g')
            .attr('class', 'group')
            .attr('fill', (d, i) => data.datasets[i].color || colors.CHART_COLORS[i]);

        groups.selectAll('rect')
            .data(d => d)
            .enter().append('rect')
            .attr('x', d => xScale(d.data.label))
            .attr('y', d => yScale(d[1]))
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .attr('width', xScale.bandwidth());
    }
}

