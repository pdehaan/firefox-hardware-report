(function() {
    'use strict'

    var global = {
        trunk: {
            width: 350,
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

    d3.json('data/hwsurvey-weekly-new-fields.json', function(data_gfx) {
        data_gfx.map(function(d) {
            //consolidate 'el capitan' releases
            d['os_Darwin-15'] = 0;
            d['os_Darwin-15'] += d['os_Darwin-15.0.0'] || 0;
            d['os_Darwin-15'] += d['os_Darwin-15.2.0'] || 0;
            d['os_Darwin-15'] += d['os_Darwin-15.3.0'] || 0;
            d['os_Darwin-15'] += d['os_Darwin-15.4.0'] || 0;
            d['os_Darwin-15'] += d['os_Darwin-15.5.0'] || 0;
            d['os_Darwin-15'] += d['os_Darwin-15.6.0'] || 0;
            
            //consolidate gpu models
            /*d['gpu_model_Other'] += d['gpu_model_gen7-ivybridge-gt1'] || 0;
            d['gpu_model_Other'] += d['gpu_model_EVERGREEN-TURKS'] || 0;
            d['gpu_model_Other'] += d['gpu_model_EVERGREEN-CEDAR'] || 0;
            d['gpu_model_Other'] += d['gpu_model_gen4.5-gma4500'] || 0;
            d['gpu_model_Other'] += d['gpu_model_gen8-broadwell-gt2'] || 0;
            d['gpu_model_Other'] += d['gpu_model_gen3-gma950'] || 0;
            d['gpu_model_Other'] += d['gpu_model_CAYMAN-ARUBA'] || 0;
            d['gpu_model_Other'] += d['gpu_model_gen5-ironlake'] || 0;
            d['gpu_model_Other'] += d['gpu_model_CIK-KABINI'] || 0;
            d['gpu_model_Other'] += d['gpu_model_EVERGREEN-PALM'] || 0;
            d['gpu_model_Other'] += d['gpu_model_gen4-gma3500'] || 0;
            d['gpu_model_Other'] += d['gpu_model_gen4.5-gma4500hd'] || 0;
            d['gpu_model_Other'] += d['gpu_model_gen9-skylake-gt2'] || 0;
            d['gpu_model_Other'] += d['gpu_model_NV40-C61'] || 0;
            d['gpu_model_Other'] += d['gpu_model_gen3-gma3100'] || 0;
            d['gpu_model_Other'] += d['gpu_model_gen7.5-haswell-gt3'] || 0;
            d['gpu_model_Other'] += d['gpu_model_gen7.5-haswell-gt1'] || 0;
            d['gpu_model_Other'] += d['gpu_model_Tesla-GT218'] || 0;
            d['gpu_model_Other'] += d['gpu_model_CIK-MULLINS'] || 0;*/
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

    function topX(prefix, data) {
      var subset = [];
      Object.keys(data).forEach(function(prop) {
        if(prop.indexOf(prefix) !== -1) {
          subset.push({key: prop, value: +data[prop]});
        }
      });

      subset.sort(function(a, b) {
        if(a.value < b.value) return 1;
        if(a.value > b.value) return -1;
        return 0;
      });
      return subset;
    }

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
            max_y: 1,
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
            max_y: 1,
            y_accessor: ['cpu_AuthenticAMD', 'cpu_GenuineIntel'],
            legend: ['AMD', 'Intel']
        });

        MG.data_graphic({
            title: "Number of Cores",
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
            max_y: 1,
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
            title: "Integrated GPU Model",
            description: "The top integrated GPU models.",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#gpu-model',
            full_width: true,
            x_accesor: 'date',
            y_accessor: ['gpu_model_gen7.5-haswell-gt2', 'gpu_model_gen7-ivybridge-gt2', 'gpu_model_gen6-sandybridge-gt2', 'gpu_model_gen6-sandybridge-gt1', 'gpu_model_gen7-ivybridge-gt1', 'gpu_model_gen4.5-gma4500hd'],
            legend: ['Haswell (GT2)', 'Ivy Bridge (GT2)', 'Sandy Bridge (GT2)', 'Sandy Bridge (GT1)', 'Ivy Bridge (GT1)', 'GMA 4500HD']
            //y_accessor: ['gpu_model_Other', 'gpu_model_gen7.5-haswell-gt2', 'gpu_model_gen7-ivybridge-gt2', 'gpu_model_gen6-sandybridge-gt2', 'gpu_model_gen6-sandybridge-gt1', 'gpu_model_gen7-ivybridge-gt1', 'gpu_model_EVERGREEN-TURKS', 'gpu_model_EVERGREEN-CEDAR', 'gpu_model_gen4.5-gma4500', 'gpu_model_gen8-broadwell-gt2', 'gpu_model_gen3-gma950', 'gpu_model_CAYMAN-ARUBA', 'gpu_model_gen5-ironlake', 'gpu_model_CIK-KABINI', 'gpu_model_EVERGREEN-PALM', 'gpu_model_gen4-gma3500', 'gpu_model_gen4.5-gma4500hd', 'gpu_model_gen9-skylake-gt2', 'gpu_model_NV40-C61', 'gpu_model_gen3-gma3100', 'gpu_model_gen7.5-haswell-gt3', 'gpu_model_gen7.5-haswell-gt1', 'gpu_model_Tesla-GT218', 'gpu_model_CIK-MULLINS'],
            //legend: ['Other', 'gpu_model_gen7.5-haswell-gt2', 'Ivy Bridge (Gen7, GT2)', 'Sandy Bridge (Gen6, GT2)', 'Sandy Bridge (Gen6, GT1)', 'Ivy Bridge (Gen7, GT1)', 'Evergreen Turks', 'Evergreen Cedar', 'Intel G45 (GMA X4500)', 'Broadwell (Gen8, GT2)', 'Intel 945 (GMA 950)', 'Cayman Aruba', 'Ironlake (Gen5)', 'gpu_model_CIK-KABINI', 'gpu_model_EVERGREEN-PALM', 'gpu_model_gen4-gma3500', 'gpu_model_gen4.5-gma4500hd', 'gpu_model_gen9-skylake-gt2', 'gpu_model_NV40-C61', 'gpu_model_gen3-gma3100', 'gpu_model_gen7.5-haswell-gt3', 'gpu_model_gen7.5-haswell-gt1', 'gpu_model_Tesla-GT218', 'gpu_model_CIK-MULLINS']
        });

        var gpu_models = topX('gpu_model_', data[0][0]);

        MG.data_graphic({
            title: "Dedicated GPU Model",
            description: "The top dedicated GPU models.",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#gpu-model-vendors',
            full_width: true,
            x_accesor: 'date',
            y_accessor: ['gpu_model_EVERGREEN-PALM', 'gpu_model_EVERGREEN-CEDAR', 'gpu_model_CAYMAN-ARUBA', 'gpu_model_NV40-C61', 'gpu_model_Tesla-GT218', 'gpu_model_R700-RV710'],
            legend: ['Radeon (Palm)', 'Radeon (Cedar)', 'Radeon (Cayman)', 'GeForce 6150SE', 'GeForce 210', 'Radeon HD 4000']
        });
        
        MG.data_graphic({
            title: "Browsers by Architecture",
            description: "The share of 32-to-64-bit browsers.",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#browser-share-32-64',
            y_accessor: ['browser_arch_x86', 'browser_arch_x86-64'],
            legend: ['32-bit', '64-bit'],
            max_y: 1,
            full_width: true,
        });

        MG.data_graphic({
            title: "OSs by Architecture",
            description: "The share of 32-to-64-bit operating systems.",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#browser-share-os-32-64',
            y_accessor: ['os_arch_x86', 'os_arch_x86-64'],
            legend: ['32-bit', '64-bit'],
            max_y: 1,
            full_width: true,
        });

        MG.data_graphic({
            title: "Processor Speed",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#processor-speed',
            max_y: 0.2,
            y_accessor: ['cpu_speed_2.4', 'cpu_speed_2.2', 'cpu_speed_2.5', 'cpu_speed_2.3', 'cpu_speed_2.0'],
            legend: ['2.4 Ghz', '2.2 Ghz', '2.5 Ghz', '2.3 Ghz', '2.0 Ghz'],
            //y_accessor: ['cpu_speed_2.3', 'cpu_speed_1.3', 'cpu_speed_1.5', 'cpu_speed_1.4', 'cpu_speed_1.7', 'cpu_speed_1.6', 'cpu_speed_1.9', 'cpu_speed_1.8', 'cpu_speed_3.3', 'cpu_speed_3.0', 'cpu_speed_3.1', 'cpu_speed_3.2', 'cpu_speed_3.4', 'cpu_speed_3.5', 'cpu_speed_3.6', 'cpu_speed_2.2', 'cpu_speed_2.4', 'cpu_speed_2.5', 'cpu_speed_2.6', 'cpu_speed_2.7', 'cpu_speed_2.0', 'cpu_speed_2.1', 'cpu_speed_2.8', 'cpu_speed_2.9', 'cpu_speed_Other'],
            //legend: ['cpu_speed_2.3', 'cpu_speed_1.3', 'cpu_speed_1.5', 'cpu_speed_1.4', 'cpu_speed_1.7', 'cpu_speed_1.6', 'cpu_speed_1.9', 'cpu_speed_1.8', 'cpu_speed_3.3', 'cpu_speed_3.0', 'cpu_speed_3.1', 'cpu_speed_3.2', 'cpu_speed_3.4', 'cpu_speed_3.5', 'cpu_speed_3.6', 'cpu_speed_2.2', 'cpu_speed_2.4', 'cpu_speed_2.5', 'cpu_speed_2.6', 'cpu_speed_2.7', 'cpu_speed_2.0', 'cpu_speed_2.1', 'cpu_speed_2.8', 'cpu_speed_2.9', 'cpu_speed_Other'],
            full_width: true,
        });

        MG.data_graphic({
            title: "Flash",
            description: "Is the Flash plugin available?",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#flash',
            y_accessor: ['has_flash_True'],
            legend: ['Yes'],
            max_y: 1,
            full_width: true,
        });

        MG.data_graphic({
            title: "Silverlight",
            description: "Is the Silverlight plugin available?",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#silverlight',
            y_accessor: ['has_silverlight_True'],
            legend: ['Yes'],
            max_y: 1,
            full_width: true,
        });

        MG.data_graphic({
            title: "Unity",
            description: "Is the Unity Web Player available?",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.trunk.width,
            height: global.trunk.height,
            xax_count: global.trunk.xax_count,
            right: global.trunk.right,
            target: '#unity',
            y_accessor: ['has_unity_True'],
            legend: ['Yes'],
            max_y: 1,
            full_width: true,
        });
    }
}());