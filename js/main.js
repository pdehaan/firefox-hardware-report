(function() {
    'use strict'

    var global = {
        trunk: {
            width: 360,
            height: 240,
            left: 0,
            right: 60,
            xax_count: 3
        }
    };

    d3.csv('data/hwsurvey-FF43-GFXStrings.csv', function(data_csv) {
    d3.json('data/hwsurvey-FF43.json', function(data_gfx) {
        var oss = getOSs(data_csv);
        data_gfx.forEach(function(d) {
            Object.assign(d, oss);
        });

        drawCharts([data_gfx]);
    });
    });

    function drawCharts(data) {
        for (var i = 0; i < data.length; i++) {
            data[i] = MG.convert.date(data[i], 'date', '%Y-%m-%dT00:00:00');
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
            y_accessor: ['gpu_NVIDIA', 'gpu_AMD', 'gpu_Intel'],
            legend: ['NVIDIA', 'AMD', 'INTEL']
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
            y_accessor: ['os_Windows_NT-5.1', 'os_Windows_NT-10.0', 'os_Windows_NT-6.3', 'os_Darwin-14.5.0', 'os_Darwin-13.4.0'],
            legend: ['Win XP', 'Win 10', 'Win 8.1', 'Yosemite', 'Mavericks']
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
            y_accessor: ['display_1366x768', 'display_1920x1080', 'display_1280x800', 'display_1440x900'],
            legend: ['1366x768', '1920x1080', '1280x800', '1440x900']
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
            y_accessor: ['ram_4', 'ram_8', 'ram_2', 'ram_3', 'ram_1'],
            legend: ['4GB', '8GB', '2GB', '3GB', '1GB']
        });
    }

    function getOSs(data) {
        var n = data.length;
        var data_point = {};
        data.map(function(d) {
            d['os-version'] = d['environment/system/os/name'] + '-' + d['environment/system/os/version'];
        });

        var nested = d3.nest()
            .key(function(d) { return d['os-version']; })
            .rollup(function(leaves) { return leaves.length; })
            .entries(data);

        nested.sort(function(a, b) {
            return b.values - a.values;
        });
        console.log('operating systems', nested);

        for (var i = 0; i < 10; i += 1) {
            data_point['os_' + nested[i].key] = nested[i].values / n;
        }

        return data_point;
    }

    /*function rawToPercentages(data_gfx) {
        var data_point = {};
        var n = data_gfx.length;

        // cpu
        nestData(data_gfx, 'environment/system/cpu/vendor', data_point, 'cpu_', '', n);

        // gpu
        nestData(data_gfx, 'environment/system/gfx/adapters[0]/vendor', data_point, 'gpu_', '', n);

        // display
        data_gfx.map(function(d) {
            d['display'] = d['environment/system/gfx/monitors[0]/width'] + 'x' + d['environment/system/gfx/monitors[0]/height'];
        });
        nestData(data_gfx, 'display', data_point, 'display_', '', n);

        // cores
        data_gfx.map(function(d) {
            d['environment/system/cpu/cores'] = d['environment/system/cpu/cores'] * d['environment/system/cpu/count'];
        });
        nestData(data_gfx, 'environment/system/cpu/cores', data_point, 'cores_', '', n);

        // ram
        data_gfx.map(function(d) {
            d['environment/system/memoryMB'] = Math.round(d['environment/system/memoryMB'] / 1000);
        });
        nestData(data_gfx, 'environment/system/memoryMB', data_point, 'ram_', 'gb', n);

        return data_point;
    }

    function nestData(data, accessor, data_out, pre, post, n) {
        var nested = d3.nest()
            .key(function(d) { return d[accessor]; })
            .rollup(function(leaves) { return leaves.length; })
            .entries(data);

        nested.sort(function(a, b) {
            return b.values - a.values;
        });
        console.log(pre, nested);

        nested.forEach(function(d) {
            data_out[pre + d.key + post] = d.values / n;
        });
    }*/
}());