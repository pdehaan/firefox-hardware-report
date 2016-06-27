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
    });

    function drawCharts(data) {
        for (var i = 0; i < data.length; i++) {
            data[i] = MG.convert.date(data[i], 'date', '%Y-%m-%d');
        }
        console.log('data', data);

        MG.data_graphic({
            title: "GPU",
            description: "Lorem ipsum dolor sit.",
            data: data,
            format: 'perc',
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
            description: "Lorem ipsum dolor sit.",
            data: data,
            format: 'perc',
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
            description: "Lorem ipsum dolor sit.",
            data: data,
            format: 'perc',
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#cpu',
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
            description: "Lorem ipsum dolor sit.",
            data: data,
            format: 'perc',
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
            description: "Lorem ipsum dolor sit.",
            data: data,
            format: 'perc',
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
    }
}());