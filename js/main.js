(function() {
    'use strict'

    var global = {
        trunk: {
            width: 360,
            height: 240,
            left: 0,
            right: 60,
            xax_count: 4
        }
    };

    // on category click
    d3.selectAll('ul.category li a.pill')
      .on('click', function() {
        d3.event.preventDefault();

        d3.selectAll('ul.category li a.pill')
            .classed('active', false);

        d3.select(this)
            .classed('active', true);

        var section = d3.select(this).attr('href').slice(6);
        document.location.hash = section;

        reorderCharts(section);

        // trigger resize since we're not resizing hidden svgs
        window.dispatchEvent(new Event('resize'));

        return false;
    });

    function reorderCharts(section) {
        if (section == 'all') {
            d3.selectAll('.chart').style('display', 'block');
            return;
        }

        d3.selectAll('.chart')
            .style('display', 'none');

        d3.selectAll('.chart.' + section)
            .style('display', 'block');
    }

    d3.json('data/hwsurvey-weekly.json', function(data_gfx) {
        data_gfx.map(function(d) {
            //consolidate 'el capitan' releases
            d['os_Darwin-15'] = 0;
            d['os_Darwin-15'] += d['os_Darwin-15.0.0'] || 0
            d['os_Darwin-15'] += d['os_Darwin-15.2.0'] || 0
            d['os_Darwin-15'] += d['os_Darwin-15.3.0'] || 0
            d['os_Darwin-15'] += d['os_Darwin-15.4.0'] || 0
            d['os_Darwin-15'] += d['os_Darwin-15.5.0'] || 0
        });

        drawCharts([data_gfx]);
        
        // on first-load
        var section = (document.location.hash) ? document.location.hash.slice(1) : 'all';
        d3.selectAll('.category li a')
            .filter(function() {
                return d3.select(this).attr('href') == '#goto-' + section;
            })
            .classed('active', true);

        reorderCharts(section);
    });

    function drawCharts(data) {
        for (var i = 0; i < data.length; i++) {
            data[i] = MG.convert.date(data[i], 'date', '%Y-%m-%d');
        }

        MG.data_graphic({
            title: "GPU",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#pc-video-card',
            full_width: true,
            x_accesor: 'date',
            y_accessor: ['gpu_AMD', 'gpu_Intel', 'gpu_NVIDIA'],
            legend: ['AMD', 'Intel', 'NVIDIA']
        });

        MG.data_graphic({
            title: "Operating System",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#operating-systems',
            full_width: true,
            x_accesor: 'date',
            y_accessor: ['os_Windows_NT-6.1', 'os_Windows_NT-10.0', 'os_Windows_NT-5.1', 'os_Windows_NT-6.3', 'os_Darwin-15'],
            legend: ['Win 7', 'Win 10', 'Win XP', 'Win 8.1', 'OS X 15']
        });

        MG.data_graphic({
            title: "Processor",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#processor',
            full_width: true,
            x_accesor: 'date',
            y_accessor: ['cpu_AuthenticAMD', 'cpu_GenuineIntel'],
            legend: ['AMD', 'Intel']
        });

        MG.data_graphic({
            title: "Number of Cores",
            description: "Number of cores. Only for PCs.",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#no-of-cpus',
            full_width: true,
            x_accesor: 'date',
            y_accessor: ['cores_2', 'cores_4', 'cores_1', 'cores_3'],
            legend: ['2 cores', '4 cores', '1 core', '3 cores']
        });

        MG.data_graphic({
            title: "Display Resolution",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#display-resolution',
            full_width: true,
            x_accesor: 'date',
            y_accessor: ['display_1366x768', 'display_1920x1080', 'display_1600x900', 'display_1280x1024', 'display_1024x768'],
            legend: ['1366x768', '1920x1080', '1600x900', '1280x1024', '1024x768']
        });
            
        MG.data_graphic({
            title: "Memory",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#ram',
            full_width: true,
            x_accesor: 'date',
            y_accessor: ['ram_4', 'ram_2', 'ram_8', 'ram_3', 'ram_1'],
            legend: ['4GB', '2GB', '8GB', '3GB', '1GB']
        });
        
        MG.data_graphic({
            title: "GPU Model",
            chart_type: 'missing-data',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#gpu-model',
            full_width: true,
        });
        
        MG.data_graphic({
            title: "Browser 32, 64 bit",
            chart_type: 'missing-data',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#browser-share-32-64',
            full_width: true,
        });
        
        MG.data_graphic({
            title: "OS 32, 64 bit",
            chart_type: 'missing-data',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#browser-share-os-32-64',
            full_width: true,
        });

        MG.data_graphic({
            title: "Browsers that can use WebGL1",
            chart_type: 'missing-data',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#browser-share-os-32-64',
            full_width: true,
        });

        MG.data_graphic({
            title: "Processor Speed",
            chart_type: 'missing-data',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#processor-speed',
            full_width: true,
        });

        MG.data_graphic({
            title: "Processor Speed",
            chart_type: 'missing-data',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#processor-speed',
            full_width: true,
        });

        MG.data_graphic({
            title: "Flash Availability",
            chart_type: 'missing-data',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#flash',
            full_width: true,
        });

        MG.data_graphic({
            title: "Silverlight Availability",
            chart_type: 'missing-data',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#silverlight',
            full_width: true,
        });

        MG.data_graphic({
            title: "Unity Web Player Availability",
            chart_type: 'missing-data',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#unity',
            full_width: true,
        });

        MG.data_graphic({
            title: "WebGL 1 Availability",
            chart_type: 'missing-data',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#webgl1',
            full_width: true,
        });
    }
}());